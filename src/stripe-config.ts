export interface StripeProduct {
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    priceId: 'price_1SXqNeG8ypIuy6LAL1GVrUW2',
    name: 'Licence principale',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme',
    mode: 'subscription',
  },
];