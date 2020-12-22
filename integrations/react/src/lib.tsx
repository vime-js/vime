/* eslint-disable react/prop-types */
import composeRefs from '@seznam/compose-react-refs';
import {
  createElement, forwardRef, HTMLAttributes, useCallback, useEffect, useMemo, useRef, useState,
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

const isEvent = (prop: string) => prop.indexOf('on') === 0 && prop[2] === prop[2]?.toUpperCase();
const toDomEventName = (prop: string) => prop.charAt(2).toLowerCase() + prop.substring(3);

export function createComponent<T extends HTMLElement, P extends HTMLAttributes<any> = {}>(
  tagName: string,
  componentProps: Set<string>,
) {
  const Component = forwardRef<T, P>(({
    children,
    ...props
  }, forwardedRef) => {
    const [ref, setRef] = useState<T | null>(null);
    const setRefCb = useCallback((node: T | null) => { setRef(node); }, []);
    const eventHandlers = useRef(new Map());

    const domProps = useMemo(() => Object.keys(props)
      .filter((prop) => !componentProps.has(prop) && !isEvent(prop))
      .reduce((p, c) => ({ ...p, [c]: (props as any)[c] }), {}), [props]);

    const wcProps = useMemo(() => Object.keys(props)
      .filter((prop) => componentProps.has(prop) || isEvent(prop))
      .reduce((p, c) => ({ ...p, [c]: (props as any)[c] }), {}), [props]);

    const listen = useCallback((prop: string, handler?: () => void) => {
      const domEvent = toDomEventName(prop);
      eventHandlers.current.get(domEvent)?.();
      if (!ref || !handler) return;
      ref!.addEventListener(domEvent, handler);
      eventHandlers.current.set(domEvent, () => { ref!.removeEventListener(domEvent, handler); });
    }, [ref]);

    const cleanup = useCallback(() => {
      eventHandlers.current.forEach((fn) => fn());
      eventHandlers.current.clear();
    }, []);

    useEffect(() => () => { cleanup(); }, []);

    useEffect(() => {
      if (!ref) return;

      Object.keys(wcProps).forEach((prop) => {
        if (isEvent(prop)) {
          listen(prop, (wcProps as any)[prop]);
          return;
        }

        if ((ref as any)[prop] !== (wcProps as any)[prop]) {
          ((ref as any)[prop] = (wcProps as any)[prop]);
        }
      });
    }, [ref, wcProps]);

    return createElement(tagName, {
      ref: composeRefs(setRefCb, forwardedRef),
      ...domProps,
    }, children);
  });

  Component.displayName = dashToPascalCase(tagName);
  return Component;
}
