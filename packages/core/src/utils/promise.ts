import { noop } from './unit';

export interface DeferredPromise<ResolveType, RejectType = unknown> {
  promise: Promise<ResolveType | undefined>;
  resolve: (value?: ResolveType) => void;
  reject: (reason: RejectType) => void;
}

/**
 * Creates an empty Promise and defers resolving/rejecting it.
 */
export const deferredPromise = <
  ResolveType,
  RejectType = unknown
>(): DeferredPromise<ResolveType, RejectType> => {
  let resolve: (value?: ResolveType | PromiseLike<ResolveType>) => void = noop;
  let reject: (reason: RejectType) => void = noop;

  const promise = new Promise<ResolveType | undefined>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
