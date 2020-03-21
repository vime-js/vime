/* eslint-disable import/no-mutable-exports,no-console */

import { noop } from 'svelte/internal';

export let log = noop;
export let warn = noop;
export let error = noop;

if (
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'development'
  && window.console !== undefined
) {
  log = function vimeLog(...args) { console.log('[Vime]', ...args); };
  warn = function vimeWarn(...args) { console.warn('[Vime warn]', ...args); };
  error = function vimeError(...args) { console.error('[Vime error]', ...args); };
}
