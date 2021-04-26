import { isUndefined } from './unit';

export const debounce = <T extends (...args: any[]) => unknown>(
  func: T,
  wait = 1000,
  immediate = false,
): T => {
  let timeout: number | undefined;

  return function executedFunction(this: unknown, ...args: unknown[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const later = function delayedFunctionCall() {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && isUndefined(timeout);
    clearTimeout(timeout);
    timeout = (setTimeout(later, wait) as unknown) as number;
    if (callNow) func.apply(context, args);
  } as T;
};
