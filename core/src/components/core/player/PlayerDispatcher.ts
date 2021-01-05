import { getElement } from '@stencil/core';
import { WritableProps } from './PlayerProps';
import { isInstanceOf } from '../../../utils/unit';

export const STATE_CHANGE_EVENT = 'vmStateChange';

export type StateChange<T = WritableProps, P extends keyof T = keyof T> = {
  by: HTMLElement;
  prop: P;
  value: T[P];
};

export type Dispatcher = <P extends keyof WritableProps>(
  prop: P,
  value: WritableProps[P]
) => void;

/**
 * Creates a dispatcher on the given `ref`, to send updates to the closest ancestor player via
 * the custom `vmStateChange` event.
 *
 * @param ref An element to dispatch the state change events from.
 */
export const createDispatcher = (ref: any): Dispatcher => (
  prop: any,
  value: any,
) => {
  const el = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);

  const event = new CustomEvent<StateChange>(STATE_CHANGE_EVENT, {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });

  el.dispatchEvent(event);
};
