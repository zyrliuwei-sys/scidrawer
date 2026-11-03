import { FooterBadges } from '@/blocks/footer-badges';
import { FooterWithBigText } from '@/components/footer-with-big-text';

export function Footer() {
  return <FooterWithBigText badges={<FooterBadges className="mt-6" />} />;
}
