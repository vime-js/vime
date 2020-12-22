import { getElement } from '@stencil/core';
import { StateChange } from '../core/player/PlayerDispatcher';
import { isInstanceOf } from '../../utils/unit';
import { ProviderWritableProps } from './ProviderProps';

export const PROVIDER_CHANGE_EVENT = 'vmProviderChange';

export type ProviderDispatcher = <P extends keyof ProviderWritableProps>(
  prop: P,
  value: ProviderWritableProps[P]
) => void;

/**
 * Creates a dispatcher on the given `ref`, to send updates to the closest ancestor player via
 * the custom `vmProviderChange` event.
 *
 * @param ref A component reference to dispatch the state change events from.
 */
export const createProviderDispatcher = (
  ref: any,
): ProviderDispatcher => (prop: any, value: any) => {
  const el = isInstanceOf(ref, HTMLElement) ? ref : getElement(ref);

  const event = new CustomEvent<StateChange<ProviderWritableProps>>(PROVIDER_CHANGE_EVENT, {
    bubbles: true,
    composed: true,
    detail: { by: el, prop, value },
  });

  el.dispatchEvent(event);
};
