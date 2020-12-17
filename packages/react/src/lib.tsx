/* eslint-disable react/prop-types */
import composeRefs from '@seznam/compose-react-refs';
import {
  createElement, forwardRef, HTMLAttributes, useCallback, useEffect, useMemo, useState,
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

    const domProps = useMemo(() => Object.keys(props)
      .filter((prop) => !componentProps.has(prop))
      .reduce((p, c) => ({ ...p, [c]: (props as any)[c] }), {}), [props]);

    const wcProps = useMemo(() => Array.from(componentProps)
      .reduce((p, c) => ({ ...p, [c]: (props as any)[c] }), {}), [props]);

    useEffect(() => {
      if (!ref) return;

      Object.keys(wcProps).forEach((prop) => {
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
