import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { InternalWritablePlayerProp, InternalWritablePlayerProps } from './PlayerProp';

export type PlayerStateChange = {
  by: HTMLStencilElement,
  prop: InternalWritablePlayerProp,
  value: any
};

export type PlayerStateDispatcher = <P extends keyof InternalWritablePlayerProps>(
  prop: P,
  value: InternalWritablePlayerProps[P]
) => void;

export const createPlayerStateDispatcher = (
  ref: any,
): PlayerStateDispatcher => (prop: any, value: any) => {
  const el = getElement(ref);

  const event = new CustomEvent<PlayerStateChange>('vStateChange', {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });

  el.dispatchEvent(event);
};
