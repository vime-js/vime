import { isUndefined } from './unit';

type RemoveIntersectionObserverCallback = () => void;

/**
 * Listen to an event on the given DOM node. Returns a callback to remove the event listener.
 */
export function listen<T extends Event | UIEvent>(
  node: EventTarget,
  event: string,
  handler: (event: T) => void,
  options?: boolean | AddEventListenerOptions | EventListenerOptions,
) {
  node.addEventListener(event, handler as EventListener, options);
  return () => node.removeEventListener(event, handler as EventListener, options);
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

export const isColliding = (a: HTMLElement, b: HTMLElement) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    ((aRect.top + aRect.height) < (bRect.top))
      || (aRect.top > (bRect.top + bRect.height))
      || ((aRect.left + aRect.width) < bRect.left)
      || (aRect.left > (bRect.left + bRect.width))
  );
};

export const buildNoAncestorSelector = (
  root: string,
  ancestor: string,
  selector: string,
  depth: number,
) => {
  const baseQuery = (modifier: string) => `${root} > ${modifier} ${selector}, `;
  const buildQuery = (deep = 1) => baseQuery(`:not(${ancestor}) >`.repeat(deep));
  let query = buildQuery(1);
  for (let i = 2; i < (depth + 1); i += 1) { query += buildQuery(i); }
  return query.slice(0, -2);
};
