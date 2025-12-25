import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const stripe = new Stripe(stripeSecret, {
  appInfo: {
    name: 'PricEye Integration',
    version: '2.0.0',
  },
});

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature found', { status: 400, headers: corsHeaders });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, stripeWebhookSecret);
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`);
      return new Response(`Webhook signature verification failed: ${error.message}`, {
        status: 400,
        headers: corsHeaders
      });
    }

    EdgeRuntime.waitUntil(handleEvent(event));

    return Response.json({ received: true }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return Response.json({ error: error.message }, { status: 500, headers: corsHeaders });
  }
});

async function handleEvent(event: Stripe.Event) {
  const stripeData = event?.data?.object ?? {};

  if (!stripeData || !('customer' in stripeData)) {
    return;
  }

  if (event.type === 'payment_intent.succeeded' && (stripeData as any).invoice === null) {
    return;
  }

  const customerId = (stripeData as any).customer;

  if (!customerId || typeof customerId !== 'string') {
    console.error(`No customer received on event: ${JSON.stringify(event)}`);
    return;
  }

  console.info(`Processing event ${event.type} for customer ${customerId}`);

  if (event.type === 'checkout.session.completed') {
    const session = stripeData as Stripe.Checkout.Session;

    if (session.mode === 'subscription') {
      console.info(`Processing subscription checkout for customer: ${customerId}`);
      await syncCustomerFromStripe(customerId);

      const userId = session.metadata?.user_id;
      if (userId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            onboarding_completed: true,
            billing_status: 'trial',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Failed to update profile:', profileError);
        } else {
          console.info(`Updated profile for user ${userId} - trial started`);
        }
      }
    }
  } else if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await syncCustomerFromStripe(customerId);
  } else if (event.type === 'invoice.paid' || event.type === 'invoice.payment_failed') {
    await syncCustomerFromStripe(customerId);
  }
}

async function syncCustomerFromStripe(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 1,
      status: 'all',
      expand: ['data.default_payment_method'],
    });

    if (subscriptions.data.length === 0) {
      console.info(`No subscriptions found for customer: ${customerId}`);
      const { error: noSubError } = await supabase.from('stripe_subscriptions').upsert(
        {
          customer_id: customerId,
          status: 'not_started',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'customer_id' }
      );

      if (noSubError) {
        console.error('Error updating subscription status:', noSubError);
      }
      return;
    }

    const subscription = subscriptions.data[0];

    const { error: subError } = await supabase.from('stripe_subscriptions').upsert(
      {
        customer_id: customerId,
        subscription_id: subscription.id,
        price_id: subscription.items.data[0]?.price.id || null,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        ...(subscription.default_payment_method && typeof subscription.default_payment_method !== 'string'
          ? {
              payment_method_brand: subscription.default_payment_method.card?.brand ?? null,
              payment_method_last4: subscription.default_payment_method.card?.last4 ?? null,
            }
          : {}),
        status: subscription.status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'customer_id' }
    );

    if (subError) {
      console.error('Error syncing subscription:', subError);
      throw new Error('Failed to sync subscription in database');
    }

    const { data: customerMapping } = await supabase
      .from('stripe_customers')
      .select('user_id')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (customerMapping?.user_id) {
      let billingStatus = 'pending';
      let subscriptionStatus = 'none';
      if (subscription.status === 'trialing') {
        billingStatus = 'trial';
        subscriptionStatus = 'trialing';
      } else if (subscription.status === 'active') {
        billingStatus = 'active';
        subscriptionStatus = 'active';
      } else if (subscription.status === 'canceled') {
        billingStatus = 'canceled';
        subscriptionStatus = 'canceled';
      } else if (subscription.status === 'past_due') {
        billingStatus = 'past_due';
        subscriptionStatus = 'past_due';
      }

      await supabase
        .from('profiles')
        .update({
          billing_status: billingStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerMapping.user_id);

      await supabase
        .from('users')
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          subscription_status: subscriptionStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', customerMapping.user_id);
    }

    console.info(`Successfully synced subscription for customer: ${customerId}`);
  } catch (error) {
    console.error(`Failed to sync subscription for customer ${customerId}:`, error);
    throw error;
  }
}