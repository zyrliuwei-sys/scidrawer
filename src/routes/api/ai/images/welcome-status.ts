import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { hasUserUsedWelcomeImageGeneration } from '@/modules/ai-tasks/service';
import { getBalance } from '@/modules/credits/service';
import { calculateImageCreditCost } from '@/lib/image-credit-cost';
import { respData, respErr } from '@/lib/resp';

/**
 * Tells the generate workspace up front whether a submit is doomed: the
 * welcome image is already spent and the balance cannot cover even the
 * cheapest possible render. The client latches `paywallDue` so clicking
 * Generate opens the paywall instantly — no doomed request, and no
 * generation placeholder flashing in the feed before the rejection lands.
 */
async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const welcomeUsed = await hasUserUsedWelcomeImageGeneration(
      session.user.id
    );
    const balance = await getBalance(session.user.id);
    return respData({
      welcomeUsed,
      balance,
      paywallDue:
        welcomeUsed &&
        balance <
          calculateImageCreditCost({
            resolution: '1K',
            quality: 'low',
            referenceCount: 0,
            count: 1,
          }),
    });
  } catch (error: any) {
    return respErr(error.message || 'Internal error');
  }
}

export const Route = createFileRoute('/api/ai/images/welcome-status')({
  server: { handlers: { GET } },
});
