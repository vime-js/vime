import { deferredPromise, makeCancellablePromise } from '../promise';

describe('deferredPromise', () => {
  it('should defer promise', (done) => {
    const deferred = deferredPromise();

    deferred.promise.then((res) => {
      expect(res).toBeTruthy();
      done();
    });

    deferred.resolve(true);
  });
});

describe('makeCancellablePromise', () => {
  it('should cancel promise', (done) => {
    const promise = new Promise<boolean>(() => {
      // no-op
    });

    const cancellable = makeCancellablePromise(promise);

    cancellable.catch((err) => {
      expect(err.message === 'Cancelled.');
      done();
    });

    cancellable.cancel();
  });
});
