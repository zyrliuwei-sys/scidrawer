import handler from '@tanstack/react-start/server-entry';

import { getCookieFromHeader } from './lib/cookie';
import { paraglideMiddleware } from './paraglide/server.js';

// On Cloudflare Workers, stash the binding env (D1, ASSETS, …) on globalThis
// so synchronous code paths (e.g. the db() singleton with DATABASE_PROVIDER=d1)
// can reach bindings without threading the request context through every call.
// The specifier is kept non-literal so bundlers leave the import to runtime;
// outside workerd the import rejects and we just move on.
const CF_WORKERS_MODULE = 'cloudflare:workers';
let cfEnvPromise: Promise<void> | null = null;

function ensureCloudflareEnv(): Promise<void> {
  if (!cfEnvPromise) {
    cfEnvPromise = import(/* @vite-ignore */ CF_WORKERS_MODULE)
      .then((mod) => {
        (globalThis as any).__CF_ENV__ = mod.env;
      })
      .catch(() => {
        // Not running on Cloudflare Workers — nothing to stash.
      });
  }
  return cfEnvPromise;
}

// The site briefly ran as a games directory. Those URLs are permanently
// retired: answer 410 so search engines drop them instead of retrying a 404.
const GONE_PATH = /^(?:\/zh)?\/(?:browse|games|category)(?:\/.*)?$/;

// Custom server entry — wraps every request in Paraglide's middleware so
// getLocale() resolves per-request (AsyncLocalStorage) during SSR.
export default {
  async fetch(req: Request): Promise<Response> {
    const requestUrl = new URL(req.url);
    // The canonical public origin is www. Do this at the server boundary so
    // the apex hostname reaches the canonical URL in one redirect, including
    // path and query string, before locale middleware or route matching runs.
    if (requestUrl.hostname === 'scidrawer.com') {
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://www.scidrawer.com${requestUrl.pathname}${requestUrl.search}`,
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }
    if (GONE_PATH.test(requestUrl.pathname)) {
      return new Response('410 Gone', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    await ensureCloudflareEnv();
    const response = await paraglideMiddleware(req, () => handler.fetch(req));
    const utmSource = new URL(req.url).searchParams.get('utm_source');
    const existing = getCookieFromHeader(
      req.headers.get('cookie'),
      'utm_source'
    );
    if (utmSource && !existing) {
      const sanitized = utmSource.replace(/[^\w.\-]/g, '').slice(0, 100);
      if (sanitized) {
        response.headers.append(
          'Set-Cookie',
          `utm_source=${sanitized}; Max-Age=2592000; Path=/; SameSite=Lax`
        );
      }
    }
    return response;
  },
};
