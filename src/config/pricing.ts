/**
 * Authoritative pricing catalog.
 *
 * The checkout API uses this as the SOURCE OF TRUTH for price/credits/duration.
 * Any price, credits, or plan info sent by the client is IGNORED — only the
 * product_id is honored, and everything else is looked up here.
 *
 * To change pricing, edit this file and redeploy. Admin UI cannot alter prices.
 */

import { PaymentInterval, PaymentType } from '@/core/payment/types';

export type PricingPlanInfo = {
  name: string;
  interval: PaymentInterval;
  intervalCount: number;
};

export type PricingProduct = {
  productId: string;
  productName: string;
  planName: string;
  description: string;
  type: PaymentType;
  priceInCents: number;
  currency: string;
  credits: number;
  creditsValidDays?: number;
  plan?: PricingPlanInfo;
};

/** Keys MUST match what the pricing UI sends as product_id. */
export const pricingCatalog: Record<string, PricingProduct> = {
  payg_starter: {
    productId: 'payg_starter',
    productName: 'Starter Credits',
    planName: 'Starter Credits',
    description: '340 render credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 500,
    currency: 'usd',
    credits: 340,
    creditsValidDays: 365,
  },
  payg_pro: {
    productId: 'payg_pro',
    productName: 'Pro Credits',
    planName: 'Pro Credits',
    description: '1,292 render credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 1900,
    currency: 'usd',
    credits: 1292,
    creditsValidDays: 365,
  },
  payg_lab: {
    productId: 'payg_lab',
    productName: 'Lab Credits',
    planName: 'Lab Credits',
    description: '2,652 render credits',
    type: PaymentType.ONE_TIME,
    priceInCents: 3900,
    currency: 'usd',
    credits: 2652,
    creditsValidDays: 365,
  },
  starter_monthly: {
    productId: 'starter_monthly',
    productName: 'Starter',
    planName: 'Starter',
    description: '612 render credits per month',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 900,
    currency: 'usd',
    credits: 612,
    plan: {
      name: 'Starter',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  pro_monthly: {
    productId: 'pro_monthly',
    productName: 'Pro',
    planName: 'Pro',
    description: '1,564 render credits per month',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 2300,
    currency: 'usd',
    credits: 1564,
    plan: { name: 'Pro', interval: PaymentInterval.MONTH, intervalCount: 1 },
  },
  lab_monthly: {
    productId: 'lab_monthly',
    productName: 'Lab',
    planName: 'Lab',
    description: '3,264 render credits per month',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 4800,
    currency: 'usd',
    credits: 3264,
    plan: {
      name: 'Lab',
      interval: PaymentInterval.MONTH,
      intervalCount: 1,
    },
  },
  starter_yearly: {
    productId: 'starter_yearly',
    productName: 'Starter',
    planName: 'Starter',
    description: '7,712 render credits per year',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 10800,
    currency: 'usd',
    credits: 7712,
    plan: { name: 'Starter', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  pro_yearly: {
    productId: 'pro_yearly',
    productName: 'Pro',
    planName: 'Pro',
    description: '19,707 render credits per year',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 27600,
    currency: 'usd',
    credits: 19707,
    plan: { name: 'Pro', interval: PaymentInterval.YEAR, intervalCount: 1 },
  },
  lab_yearly: {
    productId: 'lab_yearly',
    productName: 'Lab',
    planName: 'Lab',
    description: '41,127 render credits per year',
    type: PaymentType.SUBSCRIPTION,
    priceInCents: 57600,
    currency: 'usd',
    credits: 41127,
    plan: {
      name: 'Lab',
      interval: PaymentInterval.YEAR,
      intervalCount: 1,
    },
  },
};

export function getPricingProduct(productId: string): PricingProduct | null {
  if (!productId) return null;
  return pricingCatalog[productId] ?? null;
}

export function listPricingProducts(): PricingProduct[] {
  return Object.values(pricingCatalog);
}
