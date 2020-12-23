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
  return () =>
    node.removeEventListener(event, handler as EventListener, options);
}

export function fireEventAndRetry<T>(
  el: HTMLElement,
  event: CustomEvent<T>,
  onFail?: () => void,
  interval = 300,
  maxRetries = 10,
) {
  let timeout: any;
  let attempt = 0;
  let found = false;

  function retry() {
    if (found) return;

    timeout = setTimeout(() => {
      if (attempt === maxRetries) {
        onFail?.();
        return;
      }

      el.dispatchEvent(event);
      attempt += 1;
      retry();
    }, interval);
  }

  retry();

  return () => {
    window.clearTimeout(timeout);
    found = true;
  };
}

export const findShadowRoot = (el: Node): ShadowRoot | null => {
  if (el instanceof ShadowRoot) return el;
  if (!el.parentNode) return null;
  return findShadowRoot(el.parentNode);
};

export const isColliding = (
  a: HTMLElement,
  b: HTMLElement,
  translateAx = 0,
  translateAy = 0,
  translateBx = 0,
  translateBy = 0,
) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return (
    aRect.left + translateAx < bRect.right + translateBx &&
    aRect.right + translateAx > bRect.left + translateBx &&
    aRect.top + translateAy < bRect.bottom + translateBy &&
    aRect.bottom + translateAy > bRect.top + translateBy
  );
};

export const buildNoAncestorSelector = (
  root: string,
  ancestor: string,
  selector: string,
  depth: number,
) => {
  const baseQuery = (modifier: string) => `${root} > ${modifier} ${selector}, `;
  const buildQuery = (deep = 1) =>
    baseQuery(`:not(${ancestor}) >`.repeat(deep));
  let query = buildQuery(1);
  for (let i = 2; i < depth + 1; i += 1) {
    query += buildQuery(i);
  }
  return query.slice(0, -2);
};
