export interface Property {
  id: string;
  user_id: string;
  name: string;
  address: string;
  address_hash: string;
  parent_property_id: string | null;
  is_parent: boolean;
  position_in_tier: number;
  monthly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyGroup {
  address: string;
  addressHash: string;
  properties: Property[];
  parentId: string | null;
}

export interface MockProperty {
  id: string;
  name: string;
  address: string;
}

export interface PricingTier {
  min: number;
  max: number;
  price: number;
}

export const PRICING_TIERS: PricingTier[] = [
  { min: 1, max: 1, price: 13.99 },
  { min: 2, max: 3, price: 11.99 },
  { min: 4, max: 6, price: 9.99 },
  { min: 7, max: 10, price: 7.99 },
  { min: 11, max: 20, price: 5.99 },
  { min: 21, max: Infinity, price: 3.99 },
];

export const FLAT_CHILD_PRICE = 3.99;

export function getTierPrice(position: number): number {
  for (const tier of PRICING_TIERS) {
    if (position >= tier.min && position <= tier.max) {
      return tier.price;
    }
  }
  return PRICING_TIERS[PRICING_TIERS.length - 1].price;
}

export function calculateHybridPricing(properties: { isParent: boolean; positionInTier?: number }[]): {
  bucketA: number;
  bucketB: number;
  totalMonthly: number;
  breakdown: { type: string; count: number; price: number; subtotal: number }[];
} {
  const parentProperties = properties.filter(p => p.isParent);
  const childProperties = properties.filter(p => !p.isParent);

  let bucketATotal = 0;
  const breakdown: { type: string; count: number; price: number; subtotal: number }[] = [];

  parentProperties.forEach((p, index) => {
    const position = index + 1;
    const price = getTierPrice(position);
    bucketATotal += price;
  });

  if (parentProperties.length > 0) {
    const avgTierPrice = bucketATotal / parentProperties.length;
    breakdown.push({
      type: 'Independent + Group Parents (Tiered)',
      count: parentProperties.length,
      price: avgTierPrice,
      subtotal: bucketATotal,
    });
  }

  const bucketBTotal = childProperties.length * FLAT_CHILD_PRICE;
  if (childProperties.length > 0) {
    breakdown.push({
      type: 'Grouped Units (Flat)',
      count: childProperties.length,
      price: FLAT_CHILD_PRICE,
      subtotal: bucketBTotal,
    });
  }

  return {
    bucketA: bucketATotal,
    bucketB: bucketBTotal,
    totalMonthly: bucketATotal + bucketBTotal,
    breakdown,
  };
}
