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

export const isColliding = (
  a: HTMLElement,
  b: HTMLElement,
  aX = 0,
  aY = 0,
  bX = 0,
  bY = 0,
) => {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();

  return !(
    ((aRect.top + aRect.height) < (bRect.top + aY))
      || ((aRect.top + bY) > (bRect.top + bRect.height))
      || ((aRect.left + aRect.width) < (bRect.left + aX))
      || ((aRect.left + bX) > (bRect.left + bRect.width))
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
