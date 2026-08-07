/**
 * EvoLink GPT Image 2 pricing model for customer-facing credits.
 *
 * A balanced 1K render currently costs about 3.224 EvoLink credits upstream.
 * We charge five times that usage, rounded up: 17 internal credits. One
 * internal credit therefore represents roughly one upstream credit's dollar
 * value ($0.0147); the margin lives in the generation cost, not by relabeling
 * the credit unit.
 *
 * Source: https://evolink.ai/gpt-image-2 (checked 2026-08-07)
 */
export const IMAGE_CREDIT_PRICE_USD = 1 / 68;

const OUTPUT_CREDITS = {
  // Low / medium / high use EvoLink's documented 0.11× / 1× / 4× output
  // multipliers. 2K and 4K use the documented 4× and 8× pixel budgets.
  low: { '1K': 2, '2K': 8, '4K': 15 },
  medium: { '1K': 17, '2K': 65, '4K': 129 },
  high: { '1K': 65, '2K': 258, '4K': 516 },
} as const;

/**
 * Image-input billing depends on the input dimensions. A one-credit charge
 * per reference keeps the rate conservative without obscuring it from users.
 */
export const REFERENCE_IMAGE_CREDITS = 3;

export type ImageResolution = keyof (typeof OUTPUT_CREDITS)['medium'];
export type ImageQuality = keyof typeof OUTPUT_CREDITS;

/**
 * EvoLink ignores `resolution` for automatic and custom pixel dimensions.
 * Auto is documented as a conservative 2K estimate; custom dimensions are
 * assigned to the nearest supported pixel-budget tier.
 */
export function resolveImageBillingResolution({
  size,
  resolution,
}: {
  size?: string;
  resolution?: ImageResolution;
}): ImageResolution {
  if (size === 'auto') return '2K';

  const dimensions = /^(\d{1,4})x(\d{1,4})$/.exec(size ?? '');
  if (!dimensions) return resolution ?? '1K';

  const pixels = Number(dimensions[1]) * Number(dimensions[2]);
  if (pixels <= 1_572_864) return '1K';
  if (pixels <= 5_242_880) return '2K';
  return '4K';
}

export function calculateImageCreditCost({
  resolution,
  quality,
  referenceCount = 0,
  count = 1,
}: {
  resolution: ImageResolution;
  quality: ImageQuality;
  referenceCount?: number;
  count?: number;
}): number {
  const safeReferenceCount = Math.max(0, Math.floor(referenceCount));
  const safeCount = Math.max(1, Math.floor(count));
  const outputCredits = OUTPUT_CREDITS[quality][resolution];

  return (
    (outputCredits + safeReferenceCount * REFERENCE_IMAGE_CREDITS) * safeCount
  );
}
