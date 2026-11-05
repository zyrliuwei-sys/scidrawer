import { createFileRoute } from '@tanstack/react-router';
import { createFooterBadgeAutomationHandler } from '@/server/footer-badge-automation';
import { changeStoredFooterBadges } from '@/server/footer-badges';

import { envConfigs } from '@/config';

const POST = createFooterBadgeAutomationHandler({
  tokenHash: () => envConfigs.footer_badge_automation_token_hash,
  // Badge verifiers visit the canonical public site, which can differ from
  // the application's login/deployment origin.
  siteOrigin: () => envConfigs.site_url,
  add: (badge) => changeStoredFooterBadges({ action: 'add', badges: [badge] }),
});

export const Route = createFileRoute('/api/integrations/footer-badges')({
  server: { handlers: { POST } },
});
