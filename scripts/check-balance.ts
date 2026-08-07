/**
 * One-off script: print a user's current credit balance + recent grant records.
 *
 * Usage:
 *   pnpm tsx scripts/with-env.ts tsx scripts/check-balance.ts <email>
 */
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { credit, user } from '@/config/db/schema.postgres';
import { getBalance } from '@/modules/credits/service';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: tsx scripts/check-balance.ts <email>');
    process.exit(1);
  }

  const [target] = await db()
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!target) {
    console.log(`❌ User not found: ${email}`);
    process.exit(1);
  }

  const balance = await getBalance(target.id);
  console.log(`✅ ${target.email} — balance: ${balance} credits`);

  const grants = await db()
    .select()
    .from(credit)
    .where(
      and(eq(credit.userId, target.id), eq(credit.transactionType, 'grant'))
    )
    .orderBy(desc(credit.createdAt))
    .limit(5);

  console.log('\nRecent grant records:');
  for (const g of grants) {
    console.log(
      `  ${g.transactionNo}  +${g.credits}  remaining=${g.remainingCredits}  desc="${g.description}"  at=${g.createdAt.toISOString()}`
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});
