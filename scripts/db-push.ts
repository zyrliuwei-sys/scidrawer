import { spawnSync } from 'node:child_process';

function run(args: string[], input?: string) {
  const result = spawnSync('pnpm', ['exec', ...args], {
    stdio: input === undefined ? 'inherit' : ['pipe', 'inherit', 'inherit'],
    input,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (process.env.DATABASE_PROVIDER === 'd1') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Review generated migrations before applying them to production D1.'
    );
  }
  // D1 has no database URL. Keep a migration history and apply it using the
  // authenticated Wrangler CLI instead of touching an unrelated SQLite file.
  run(['drizzle-kit', 'generate', '--config=drizzle.config.ts']);
  run(['wrangler', 'd1', 'migrations', 'apply', 'DB', '--remote'], 'y\n');
} else {
  run(['drizzle-kit', 'push', '--config=drizzle.config.ts']);
}
