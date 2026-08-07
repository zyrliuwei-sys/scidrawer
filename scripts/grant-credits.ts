/**
 * One-off script: grant credits to a user by email.
 *
 * Usage:
 *   pnpm tsx scripts/grant-credits.ts <email> <credits> [description]
 *
 * Example:
 *   pnpm tsx scripts/grant-credits.ts zyrliuwei@gmail.com 1000 "Promo grant"
 */
import { eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { user } from '@/config/db/schema.postgres';
import {
  CreditTransactionScene,
  getBalance,
  grant,
} from '@/modules/credits/service';

async function main() {
  const [emailArg, creditsArg, ...descParts] = process.argv.slice(2);

  if (!emailArg || !creditsArg) {
    console.error(
      'Usage: tsx scripts/grant-credits.ts <email> <credits> [description]'
    );
    process.exit(1);
  }

  const email = emailArg.trim();
  const credits = Number(creditsArg);
  const description = descParts.join(' ') || 'Admin grant';

  if (!Number.isFinite(credits) || credits <= 0) {
    console.error(`Invalid credits: ${creditsArg}`);
    process.exit(1);
  }

  const [target] = await db()
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!target) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  const balanceBefore = await getBalance(target.id);

  await grant({
    userId: target.id,
    userEmail: target.email,
    credits,
    description,
    scene: CreditTransactionScene.GIFT,
  });

  const balanceAfter = await getBalance(target.id);

  console.log(`✅ Granted ${credits} credits to ${target.email}`);
  console.log(`   userId:    ${target.id}`);
  console.log(`   balance:   ${balanceBefore} → ${balanceAfter}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
