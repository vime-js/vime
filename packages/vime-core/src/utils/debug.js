/* eslint-disable no-undef */
/* eslint-disable import/no-mutable-exports,no-console */

const noop = () => {}

export let log = noop
export let warn = noop
export let error = noop

if (
  process.env.NODE_ENV === 'development' &&
  window.console !== undefined
) {
  log = function () { console.log('[Vime]', ...arguments) }
  warn = function () { console.warn('[Vime warn]', ...arguments) }
  error = function () { console.error('[Vime error]', ...arguments) }
}
