import { getElement } from '@stencil/core';
import { InternalWritablePlayerProp, InternalWritablePlayerProps } from './PlayerProp';
import { isInstanceOf } from '../../../utils/unit';

export type PlayerStateChange = {
  by: HTMLElement,
  prop: InternalWritablePlayerProp,
  value: any
};

export type PlayerDispatcher = <P extends keyof InternalWritablePlayerProps>(
  prop: P,
  value: InternalWritablePlayerProps[P]
) => void;

export const createPlayerDispatcher = (
  ref: any,
): PlayerDispatcher => (prop: any, value: any) => {
  const el = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);

  const event = new CustomEvent<PlayerStateChange>('vStateChange', {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });

  el.dispatchEvent(event);
};
