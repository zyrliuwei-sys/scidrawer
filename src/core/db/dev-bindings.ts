import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { promisify } from 'node:util';
import {
  getPlatformProxy,
  unstable_readConfig,
  type PlatformProxy,
} from 'wrangler';

import { createD1HttpBinding } from './d1-http';

let platformPromise:
  | Promise<PlatformProxy<Record<string, unknown>>>
  | undefined;
const execute = promisify(execFile);
let authPromise: Promise<Record<string, string>> | undefined;
let authExpiresAt = 0;

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (Date.now() >= authExpiresAt) authPromise = undefined;
  if (!authPromise) {
    authExpiresAt = Date.now() + 5 * 60_000;
    authPromise = (async (): Promise<Record<string, string>> => {
      try {
        const { stdout } = await execute(
          process.execPath,
          [
            resolve('node_modules/wrangler/bin/wrangler.js'),
            'auth',
            'token',
            '--json',
          ],
          {
            env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
            timeout: 30_000,
          }
        );
        const auth = JSON.parse(stdout);
        if (auth.type === 'api_key') {
          return { 'X-Auth-Key': auth.key, 'X-Auth-Email': auth.email };
        }
        if (!auth.token) throw new Error('Missing authentication');
        return { Authorization: `Bearer ${auth.token}` };
      } catch {
        // Child-process errors may contain captured token output. Never pass
        // the original error to a request handler or log it.
        throw new Error(
          'Cloudflare authentication failed. Run wrangler login.'
        );
      }
    })();
  }
  return authPromise;
}

/** Make Wrangler bindings available to the Node-based Vite dev server. */
export async function ensureDevelopmentBindings() {
  const runtime = globalThis as any;
  if (runtime.__CF_ENV__?.DB) return;

  const config = unstable_readConfig({ config: 'wrangler.jsonc' });
  const binding = config.d1_databases.find(
    (item: { binding: string; remote?: boolean; database_id?: string }) =>
      item.binding === 'DB'
  );
  if (binding?.remote) {
    if (!config.account_id || !binding.database_id) {
      throw new Error(
        'Configure account_id and the DB database_id in wrangler.jsonc.'
      );
    }
    runtime.__CF_ENV__ = {
      DB: createD1HttpBinding({
        accountId: config.account_id,
        databaseId: binding.database_id,
        getHeaders: getAuthHeaders,
      }),
    };
    return;
  }

  try {
    platformPromise ??= getPlatformProxy({
      configPath: 'wrangler.jsonc',
      envFiles: [],
      remoteBindings: false,
    });
    const platform = await platformPromise;
    if (!platform.env.DB) {
      throw new Error('Add a D1 binding named DB to wrangler.jsonc.');
    }
    runtime.__CF_ENV__ = platform.env;
  } catch (error) {
    platformPromise = undefined;
    throw error;
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(async () => {
    const platform = await platformPromise?.catch(() => undefined);
    await platform?.dispose();
  });
}
