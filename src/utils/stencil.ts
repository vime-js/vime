import { ComponentInterface } from '@stencil/core';

import { isUndefined } from './unit';

export type StencilHook =
  | 'connectedCallback'
  | 'disconnectedCallback'
  | 'componentWillRender'
  | 'componentDidRender'
  | 'componentWillLoad'
  | 'componentDidLoad'
  | 'componentShouldUpdate'
  | 'componentWillUpdate'
  | 'componentDidUpdate';

export function wrapStencilHook<P extends keyof ComponentInterface>(
  component: ComponentInterface,
  lifecycle: P,
  hook: ComponentInterface[P],
): void {
  const prevHook = component[lifecycle];
  component[lifecycle] = function () {
    hook();
    return prevHook ? prevHook.call(component) : undefined;
  };
}

export function createStencilHook(
  component: ComponentInterface,
  onConnect?: () => void,
  onDisconnect?: () => void,
): void {
  let hasLoaded = false;

  if (!isUndefined(onConnect)) {
    wrapStencilHook(component, 'componentWillLoad', () => {
      onConnect();
      hasLoaded = true;
    });

    wrapStencilHook(component, 'connectedCallback', () => {
      if (hasLoaded) onConnect();
    });
  }

  if (!isUndefined(onDisconnect)) {
    wrapStencilHook(component, 'disconnectedCallback', () => {
      onDisconnect();
    });
  }
}
