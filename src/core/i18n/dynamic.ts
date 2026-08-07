import { m } from '@/paraglide/messages.js';

type MessageFn = (
  inputs?: Record<string, unknown>,
  options?: { locale?: string }
) => string;

// Dynamic message lookup for keys built at runtime (tab labels, keyed
// lists). Prefer static `m["ns.key"]()` whenever the key is known —
// dynamic access opts the whole message bundle out of tree-shaking.
//
// `options.locale` mirrors paraglide's second argument; pass it when the
// ambient locale isn't reliable (e.g. resolving copy inside a route loader).
export function tDynamic(key: string, options?: { locale?: string }): string {
  const fn = (m as Record<string, unknown>)[key];
  return typeof fn === 'function' ? (fn as MessageFn)({}, options) : key;
}
