'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';

import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type PricingFeature =
  | string
  | { icon?: IconComponent; label: string; tooltip?: string };

export interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: string;
  originalPrice?: string;
  currency?: string;
  interval?: string;
  /**
   * Override for the interval label rendered after the price. Use when the
   * billing interval differs from the unit you want to show users — yearly
   * plans can pass `displayInterval: 'mo'` to show "$7 / mo" while the
   * underlying subscription still bills annually.
   */
  displayInterval?: string;
  /** Optional resolution label rendered next to the plan name (e.g. "1K", "2K", "4K"). */
  resolution?: string;
  featured?: boolean;
  badge?: string;
  features: PricingFeature[];
  buttonText?: string;
  productId?: string;
  productName?: string;
  paymentProvider?: string;
  priceInCents?: number;
  credits?: number;
  creditsValidDays?: number;
  plan?: {
    name: string;
    interval: string;
    intervalCount: number;
  };
}

export interface PricingGroup {
  key: string;
  label: string;
  plans: PricingPlan[];
}

export function PricingTable({
  groups,
  onCheckout,
}: {
  groups: PricingGroup[];
  onCheckout?: (plan: PricingPlan) => void;
}) {
  const [activeGroup, setActiveGroup] = useState(() => {
    const monthly = groups.find((g) => g.key === 'monthly');
    if (monthly) return monthly.key;
    const payg = groups.find((g) => g.key === 'pay_as_you_go');
    if (payg) return payg.key;
    return groups[0]?.key || '';
  });
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const currentGroup = groups.find((g) => g.key === activeGroup) || groups[0];

  const checkoutMutation = useMutation({
    mutationFn: (plan: PricingPlan) =>
      apiPost<{ checkout_url?: string }>('/api/payment/checkout', {
        product_id: plan.productId,
        product_name: plan.productName || plan.name,
        plan_name: plan.plan?.name || plan.name,
        price: plan.priceInCents,
        currency: plan.currency || 'usd',
        type: plan.plan ? 'subscription' : 'one-time',
        description: plan.name,
        plan: plan.plan,
        credits: plan.credits,
        credits_valid_days: plan.creditsValidDays,
        payment_provider: plan.paymentProvider || 'stripe',
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (data?.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onSettled: () => {
      setLoadingId(null);
    },
  });

  function handleCheckout(plan: PricingPlan) {
    if (onCheckout) {
      onCheckout(plan);
      return;
    }

    if (!plan.productId || !plan.priceInCents) return;

    setLoadingId(plan.id);
    checkoutMutation.mutate(plan);
  }

  return (
    <div className="relative">
      {/* Group tabs — animated pill toggle */}
      {groups.length > 1 && (
        <div className="bg-muted mx-auto mb-12 flex w-fit items-center justify-center overflow-hidden rounded-full p-1">
          {groups.map((group) => (
            <button
              key={group.key}
              onClick={() => setActiveGroup(group.key)}
              className={cn(
                'relative rounded-full px-5 py-2 text-sm font-medium transition-colors',
                activeGroup === group.key
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {activeGroup === group.key && (
                <motion.span
                  layoutId="pricing-toggle-pill"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  className="bg-primary absolute inset-0 rounded-full"
                />
              )}
              <span className="relative z-10">{group.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Plans grid — flush columns inside a bordered band */}
      <div
        className={cn(
          'border-border bg-muted/30 relative z-20 mx-auto grid grid-cols-1 items-stretch border-y',
          currentGroup?.plans.length === 2
            ? 'max-w-3xl md:grid-cols-2'
            : currentGroup?.plans.length === 3
              ? 'max-w-5xl md:grid-cols-2 xl:grid-cols-3'
              : 'max-w-6xl md:grid-cols-2 xl:grid-cols-4'
        )}
      >
        {currentGroup?.plans.map((plan, planIdx) => (
          <div
            key={plan.id}
            className={cn(
              'relative flex h-full flex-col justify-between px-6 py-8',
              plan.featured ? 'bg-background shadow-2xl' : 'bg-transparent'
            )}
          >
            <div>
              {/* Badge — "Most popular" / "Best value" */}
              {plan.badge && (
                <span className="bg-primary text-primary-foreground absolute top-8 right-6 rounded-full px-3 py-1 text-xs font-medium">
                  {plan.badge}
                </span>
              )}

              {/* Plan name */}
              {plan.name && (
                <h3
                  className={cn(
                    'flex items-baseline gap-2 text-base leading-7 font-semibold',
                    plan.featured ? 'text-foreground' : 'text-foreground/80'
                  )}
                >
                  {plan.name}
                </h3>
              )}

              {/* Price */}
              <p className="mt-4 flex items-baseline gap-1">
                <motion.span
                  key={activeGroup}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                    delay: 0.1 * planIdx,
                  }}
                  className="inline-block font-serif text-4xl font-bold tracking-tight"
                >
                  {plan.price}
                </motion.span>
                {(plan.displayInterval || plan.interval) && (
                  <span className="text-muted-foreground text-sm">
                    /{plan.displayInterval || plan.interval}
                  </span>
                )}
                {plan.originalPrice && (
                  <span className="text-muted-foreground text-sm line-through">
                    {plan.originalPrice}
                  </span>
                )}
              </p>

              {/* Description */}
              {plan.description && (
                <p className="text-muted-foreground mt-6 h-12 text-sm leading-7">
                  {plan.description}
                </p>
              )}

              {/* Features */}
              <ul className="text-muted-foreground mt-2 space-y-3 text-sm leading-6 sm:mt-4">
                {plan.features.map((feature, i) => {
                  const isObj = typeof feature !== 'string';
                  const Icon: IconComponent =
                    (isObj && feature.icon) || CircleCheck;
                  const label = isObj ? feature.label : feature;
                  return (
                    <li key={i} className="flex gap-x-3">
                      <Icon
                        className={cn(
                          'h-5 w-5 flex-none',
                          plan.featured
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        )}
                        aria-hidden="true"
                      />
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* CTA */}
            <Button
              variant={plan.featured ? 'default' : 'outline'}
              className="mt-8 h-10 w-full rounded-lg text-sm font-semibold transition duration-200 hover:-translate-y-1 sm:mt-10"
              onClick={() => handleCheckout(plan)}
              disabled={loadingId === plan.id}
            >
              {loadingId === plan.id
                ? m['common.pricing.processing']()
                : plan.buttonText || m['common.pricing.get_started']()}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Decorative plus sign used at the corners of the pricing frame. */
export function PricingCornerIcon({
  className,
  ...rest
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1"
      stroke="currentColor"
      className={cn(
        'text-muted-foreground/60 h-4 w-4 md:h-8 md:w-8',
        className
      )}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
}
