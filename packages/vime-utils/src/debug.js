/* eslint-disable no-undef */
/* eslint-disable import/no-mutable-exports,no-console */

import { noop } from 'svelte/internal'

export let log = noop
export let warn = noop
export let error = noop

export const createLogger = (debug, id) => ({
  log: function () { debug && logger.log(id, '::', ...arguments) },
  warn: function () { debug && logger.warn(id, '::', ...arguments) },
  error: function () { debug && logger.error(id, '::', ...arguments) }
})

if (
  process.env.NODE_ENV === 'development' &&
  window.console !== undefined
) {
  log = function () { console.log('[Vime]', ...arguments) }
  warn = function () { console.warn('[Vime warn]', ...arguments) }
  error = function () { console.error('[Vime error]', ...arguments) }
}
