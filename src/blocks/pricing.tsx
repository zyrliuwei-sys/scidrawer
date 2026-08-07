'use client';

import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Download,
  Image as ImageIcon,
  Languages,
  Layers,
  LayoutGrid,
  PenLine,
  Scissors,
  Sparkles,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { currentPathWithQuery } from '@/lib/redirect';
import { m } from '@/paraglide/messages.js';
import { usePublicConfig } from '@/hooks/use-public-config';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import {
  PricingCornerIcon,
  PricingTable,
  type PricingGroup,
  type PricingPlan,
} from '@/components/pricing-table';

const ALL_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'paypal',
  'alipay',
  'wechat',
];

export function Pricing({ title }: { title?: string } = {}) {
  const router = useRouter();
  const { data: session } = useSession();

  const { data: configsData } = usePublicConfig();
  const configs = configsData ?? {};
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PricingPlan | null>(null);
  const [loadingProvider, setLoadingProvider] =
    useState<PaymentProvider | null>(null);

  const enabledProviders = useMemo<PaymentProvider[]>(
    () => ALL_PROVIDERS.filter((p) => configs[`${p}_enabled`] === 'true'),
    [configs]
  );

  const starterFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_612_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: Languages, label: m['landing.pricing.f_bilingual']() },
  ];
  const proFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_1564_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Zap, label: m['landing.pricing.f_priority']() },
  ];
  const labFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_3264_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Wand2, label: m['landing.pricing.f_batch']() },
    { icon: Scissors, label: m['landing.pricing.f_mask']() },
    { icon: Users, label: m['landing.pricing.f_team']() },
    { icon: Zap, label: m['landing.pricing.f_support']() },
  ];
  const annualStarterFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_7712_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: Languages, label: m['landing.pricing.f_bilingual']() },
  ];
  const annualProFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_19707_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Zap, label: m['landing.pricing.f_priority']() },
  ];
  const annualLabFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_41127_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Wand2, label: m['landing.pricing.f_batch']() },
    { icon: Scissors, label: m['landing.pricing.f_mask']() },
    { icon: Users, label: m['landing.pricing.f_team']() },
    { icon: Zap, label: m['landing.pricing.f_support']() },
  ];
  const paygStarterFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_340_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: Download, label: m['landing.pricing.f_png']() },
    { icon: Sparkles, label: m['landing.pricing.f_text2image']() },
  ];
  const paygProFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_1292_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Zap, label: m['landing.pricing.f_priority']() },
  ];
  const paygLabFeatures = [
    { icon: ImageIcon, label: m['landing.pricing.f_2652_credits']() },
    { icon: Sparkles, label: m['landing.pricing.f_credit_rate']() },
    { icon: LayoutGrid, label: m['landing.pricing.f_library']() },
    { icon: PenLine, label: m['landing.pricing.f_sketch']() },
    { icon: Layers, label: m['landing.pricing.f_reference']() },
    { icon: Wand2, label: m['landing.pricing.f_batch']() },
    { icon: Scissors, label: m['landing.pricing.f_mask']() },
    { icon: Users, label: m['landing.pricing.f_team']() },
    { icon: Zap, label: m['landing.pricing.f_support']() },
  ];

  const groups: PricingGroup[] = [
    {
      key: 'pay_as_you_go',
      label: m['landing.pricing.pay_as_you_go'](),
      plans: [
        {
          id: 'payg-starter',
          name: m['landing.pricing.payg_starter'](),
          description: m['landing.pricing.payg_starter_desc'](),
          price: '$5',
          interval: 'once',
          features: paygStarterFeatures,
          productId: 'payg_starter',
          productName: 'Starter Credits',
          priceInCents: 500,
          currency: 'usd',
          credits: 340,
          creditsValidDays: 365,
        },
        {
          id: 'payg-pro',
          name: m['landing.pricing.payg_pro'](),
          description: m['landing.pricing.payg_pro_desc'](),
          price: '$19',
          interval: 'once',
          featured: true,
          badge: m['landing.pricing.popular'](),
          features: paygProFeatures,
          productId: 'payg_pro',
          productName: 'Pro Credits',
          priceInCents: 1900,
          currency: 'usd',
          credits: 1292,
          creditsValidDays: 365,
        },
        {
          id: 'payg-lab',
          name: m['landing.pricing.payg_lab'](),
          description: m['landing.pricing.payg_lab_desc'](),
          price: '$39',
          interval: 'once',
          features: paygLabFeatures,
          productId: 'payg_lab',
          productName: 'Lab Credits',
          priceInCents: 3900,
          currency: 'usd',
          credits: 2652,
          creditsValidDays: 365,
        },
      ],
    },
    {
      key: 'monthly',
      label: m['landing.pricing.monthly'](),
      plans: [
        {
          id: 'starter-monthly',
          name: m['landing.pricing.starter'](),
          description: m['landing.pricing.starter_desc'](),
          price: '$9',
          interval: 'mo',
          features: starterFeatures,
          productId: 'starter_monthly',
          priceInCents: 900,
          currency: 'usd',
          credits: 612,
          plan: { name: 'Starter', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'pro-monthly',
          name: m['landing.pricing.pro'](),
          description: m['landing.pricing.pro_desc'](),
          price: '$23',
          interval: 'mo',
          featured: true,
          badge: m['landing.pricing.popular'](),
          features: proFeatures,
          productId: 'pro_monthly',
          priceInCents: 2300,
          currency: 'usd',
          credits: 1564,
          plan: { name: 'Pro', interval: 'month', intervalCount: 1 },
        },
        {
          id: 'lab-monthly',
          name: m['landing.pricing.lab'](),
          description: m['landing.pricing.lab_desc'](),
          price: '$48',
          interval: 'mo',
          features: labFeatures,
          productId: 'lab_monthly',
          priceInCents: 4800,
          currency: 'usd',
          credits: 3264,
          plan: { name: 'Lab', interval: 'month', intervalCount: 1 },
        },
      ],
    },
    {
      key: 'yearly',
      label: m['landing.pricing.yearly'](),
      plans: [
        {
          id: 'starter-yearly',
          name: m['landing.pricing.starter'](),
          description: m['landing.pricing.starter_desc'](),
          price: '$9',
          interval: 'yr',
          displayInterval: 'mo',
          billingNote: m['landing.pricing.billed_annually']({
            amount: '$108',
          }),
          features: annualStarterFeatures,
          productId: 'starter_yearly',
          priceInCents: 10800,
          currency: 'usd',
          credits: 7712,
          plan: { name: 'Starter', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'pro-yearly',
          name: m['landing.pricing.pro'](),
          description: m['landing.pricing.pro_desc'](),
          price: '$23',
          interval: 'yr',
          displayInterval: 'mo',
          billingNote: m['landing.pricing.billed_annually']({
            amount: '$276',
          }),
          featured: true,
          badge: m['landing.pricing.popular'](),
          features: annualProFeatures,
          productId: 'pro_yearly',
          priceInCents: 27600,
          currency: 'usd',
          credits: 19707,
          plan: { name: 'Pro', interval: 'year', intervalCount: 1 },
        },
        {
          id: 'lab-yearly',
          name: m['landing.pricing.lab'](),
          description: m['landing.pricing.lab_desc'](),
          price: '$48',
          interval: 'yr',
          displayInterval: 'mo',
          billingNote: m['landing.pricing.billed_annually']({
            amount: '$576',
          }),
          features: annualLabFeatures,
          productId: 'lab_yearly',
          priceInCents: 57600,
          currency: 'usd',
          credits: 41127,
          plan: { name: 'Lab', interval: 'year', intervalCount: 1 },
        },
      ],
    },
  ];

  const checkoutMutation = useMutation({
    mutationFn: ({
      plan,
      provider,
    }: {
      plan: PricingPlan;
      provider: PaymentProvider;
    }) =>
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
        payment_provider: provider,
        // Come back to the page the user paid from.
        redirect: currentPathWithQuery('/settings/billing'),
      }),
    onSuccess: (data) => {
      if (!data?.checkout_url) {
        toast.error('Checkout failed');
        setLoadingProvider(null);
        return;
      }
      window.location.href = data.checkout_url;
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Checkout failed');
      setLoadingProvider(null);
    },
  });

  function startCheckout(plan: PricingPlan, provider: PaymentProvider) {
    setLoadingProvider(provider);
    checkoutMutation.mutate({ plan, provider });
  }

  async function handleCheckout(plan: PricingPlan) {
    if (!session?.user) {
      const callbackUrl = encodeURIComponent(currentPathWithQuery('/pricing'));
      router.push(`/sign-in?callbackUrl=${callbackUrl}`);
      return;
    }

    const selectEnabled = configs.select_payment_enabled === 'true';
    const defaultProvider = (configs.default_payment_provider ||
      enabledProviders[0] ||
      'stripe') as PaymentProvider;

    if (selectEnabled && enabledProviders.length > 1) {
      setPendingPlan(plan);
      setModalOpen(true);
      return;
    }

    await startCheckout(plan, defaultProvider);
  }

  function handleProviderSelect(provider: PaymentProvider) {
    if (!pendingPlan) return;
    startCheckout(pendingPlan, provider);
  }

  return (
    <section id="pricing" className="px-4 py-24 sm:py-32">
      <div className="border-border relative mx-auto flex max-w-7xl flex-col items-center justify-between border py-10 md:py-20">
        <PricingCornerIcon className="absolute -top-4 -left-4" />
        <PricingCornerIcon className="absolute -top-4 -right-4" />
        <PricingCornerIcon className="absolute -bottom-4 -left-4" />
        <PricingCornerIcon className="absolute -right-4 -bottom-4" />

        <div className="relative w-full px-4 md:px-8">
          <h2 className="text-center font-serif text-3xl font-normal tracking-tight md:text-5xl">
            {title ?? m['landing.pricing.title']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-center text-sm md:text-base">
            {m['landing.pricing.description']()}
          </p>
        </div>

        <div className="mt-10 w-full md:mt-16">
          <PricingTable groups={groups} onCheckout={handleCheckout} />
        </div>
      </div>

      <PaymentProviderModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            setPendingPlan(null);
            setLoadingProvider(null);
          }
        }}
        providers={enabledProviders.length ? enabledProviders : ['stripe']}
        loadingProvider={loadingProvider}
        onSelect={handleProviderSelect}
        planName={pendingPlan?.name}
        price={pendingPlan?.price}
      />
    </section>
  );
}
