import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'PricEye Integration',
    version: '2.0.0',
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

function corsResponse(body: string | object | null, status = 200) {
  if (status === 204) {
    return new Response(null, { status, headers: corsHeaders });
  }
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const DEFAULT_TRIAL_PRICE = 13.99;

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse({}, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { success_url, cancel_url, mode, trial_period_days } = await req.json();

    if (!success_url || !cancel_url) {
      return corsResponse({ error: 'Missing required parameters: success_url and cancel_url' }, 400);
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return corsResponse({ error: 'Missing authorization header' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer:', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    let customerId: string;

    if (!customer || !customer.customer_id) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });

      const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
        user_id: user.id,
        customer_id: newCustomer.id,
      });

      if (createCustomerError) {
        console.error('Failed to save customer:', createCustomerError);
        await stripe.customers.del(newCustomer.id);
        return corsResponse({ error: 'Failed to create customer mapping' }, 500);
      }

      customerId = newCustomer.id;
    } else {
      customerId = customer.customer_id;
    }

    let trialProduct = await stripe.products.list({
      limit: 10,
      active: true,
    }).then(res => res.data.find(p => p.name === 'PricEye Main License'));

    if (!trialProduct) {
      trialProduct = await stripe.products.create({
        name: 'PricEye Main License',
        description: 'Dynamic pricing platform - Main license subscription',
      });
    }

    const trialPrice = await stripe.prices.create({
      product: trialProduct.id,
      unit_amount: Math.round(DEFAULT_TRIAL_PRICE * 100),
      currency: 'eur',
      recurring: { interval: 'month' },
      nickname: 'Main License - Trial Setup',
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: trialPrice.id,
        quantity: 1,
      },
    ];

    const { data: existingSub } = await supabase
      .from('stripe_subscriptions')
      .select('id')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (!existingSub) {
      await supabase.from('stripe_subscriptions').insert({
        customer_id: customerId,
        status: 'not_started',
      });
    }

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: lineItems,
      mode: mode || 'subscription',
      success_url,
      cancel_url,
      subscription_data: {
        trial_period_days: trial_period_days || 30,
      },
      payment_method_collection: 'always',
      metadata: {
        user_id: user.id,
        trial_setup: 'true',
      },
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    console.log(`Created trial checkout session ${session.id} for customer ${customerId}`);

    return corsResponse({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return corsResponse({ error: error.message }, 500);
  }
});