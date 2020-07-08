import { isUndefined } from './unit';

type RemoveIntersectionObserverCallback = () => void;

/**
 * Listen to an event on the given DOM node. Returns a callback to remove the event listener.
 */
export function listen(
  node: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions | EventListenerOptions,
) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}

/**
 * Fires the given callback when the given element is visible in the viewport. Returns a
 * cleanup function.
 */
export const onElementEntersViewport = (
  el: HTMLElement,
  cb: () => void,
  options = { threshold: 0.25 },
): RemoveIntersectionObserverCallback => {
  if (!isUndefined(window.IntersectionObserver)) {
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        cb();
        observer.unobserve(el);
      }
    }, { threshold: options.threshold });

    observer.observe(el);
    return () => { observer.unobserve(el); };
  }

  function onScroll() {
    const rect = el.getBoundingClientRect();

    const isIntersecting = (
      rect.bottom > 0
      && rect.right > 0
      && (rect.top * (1 + options.threshold)) < window.innerHeight
      && rect.left < window.innerWidth
    );

    if (isIntersecting) {
      cb();
      window.removeEventListener('scroll', onScroll);
    }
  }

  window.addEventListener('scroll', onScroll);
  return () => window.removeEventListener('scroll', onScroll);
};
