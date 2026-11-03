import { createFileRoute } from '@tanstack/react-router';

import { AdminFooterBadges } from '@/blocks/admin-footer-badges';

export const Route = createFileRoute('/admin/footer-badges')({
  component: AdminFooterBadges,
});
