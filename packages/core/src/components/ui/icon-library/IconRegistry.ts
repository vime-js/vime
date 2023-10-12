/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon-library/icon-library-registry.ts
 */

import { getElement } from '@stencil/core';

import { createStencilHook } from '../../../utils/stencil';
import { isUndefined } from '../../../utils/unit';

export type IconLibraryResolver = (name: string) => string;

export const ICONS_BASE_CDN_URL =
  process.env.NODE_ENV === 'development'
    ? '/icons'
    : 'https://unpkg.com/@vime/core@5.3.1/icons';

const registry = new Map<string, IconLibraryResolver>(
  Object.entries({
    vime: iconName => `${ICONS_BASE_CDN_URL}/vime/vm-${iconName}.svg`,
    material: iconName => `${ICONS_BASE_CDN_URL}/material/md-${iconName}.svg`,
  }),
);

const watch = new Set<HTMLVmIconElement>();

export function withIconRegistry(component: any) {
  const el = getElement(component) as HTMLVmIconElement;
  createStencilHook(
    component,
    () => {
      watch.add(el);
    },
    () => {
      watch.delete(el);
    },
  );
}

export const getIconLibraryResolver = (name: string) => registry.get(name);

export function registerIconLibrary(
  name: string,
  resolver?: IconLibraryResolver,
) {
  if (!isUndefined(resolver)) {
    registry.set(name, resolver);
  }

  // Redraw watched icons.
  watch.forEach(iconEl => {
    if (iconEl.library === name) iconEl.redraw();
  });
}

export function deregisterIconLibrary(name: string) {
  registry.delete(name);
}
