import composeRefs from '@seznam/compose-react-refs';
import {
  createElement, forwardRef, useCallback, useEffect, useRef, useState,
} from 'react';

export const define = (tagName: string, clazz: any) => {
  const isClient = (typeof window !== 'undefined');
  if (isClient && !customElements.get(tagName)) customElements.define(tagName, clazz);
};

const dashToPascalCase = (str: string) => str
  .toLowerCase()
  .split('-')
  .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
  .join('');

export function createComponent<T extends HTMLElement, P = {}>(tagName: string) {
  const isEvent = (prop: string) => prop.indexOf('on') === 0 && prop[2] === prop[2].toUpperCase();
  const toDomEventName = (prop: string) => prop[0].toLowerCase() + prop.substring(1);

  const Component = forwardRef<T, P>(({
    // eslint-disable-next-line react/prop-types
    children,
    ...props
  }, forwardedRef) => {
    const [ref, setRef] = useState<T | null>(null);
    const setRefCb = useCallback((node: T | null) => { setRef(node); }, []);
    const cache = useRef(new Map());
    const eventHandlers = useRef(new Map());

    const listen = useCallback((prop: string, handler?: () => void) => {
      const domEvent = toDomEventName(prop);
      eventHandlers.current.get(domEvent)?.();
      if (!ref || !handler) return;
      ref!.addEventListener(domEvent, handler);
      eventHandlers.current.set(domEvent, () => { ref!.removeEventListener(domEvent, handler); });
    }, []);

    const cleanup = useCallback(() => {
      cache.current.clear();
      eventHandlers.current.forEach((fn) => fn());
      eventHandlers.current.clear();
    }, []);

    useEffect(() => () => { cleanup(); }, []);

    useEffect(() => {
      if (!ref) {
        cleanup();
        return;
      }

      Object.keys(props).forEach((prop) => {
        if (cache.current.get(prop) !== (props as any)[prop]) {
          isEvent(prop)
            ? listen(prop, (props as any)[prop])
            : ((ref as any)[prop] = (props as any)[prop]);

          cache.current.set(prop, (props as any)[prop]);
        }
      });
    }, [ref, props]);

    return createElement(tagName, { ref: composeRefs(setRefCb, forwardedRef) }, children);
  });

  Component.displayName = dashToPascalCase(tagName);
  return Component;
}
