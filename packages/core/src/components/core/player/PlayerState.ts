import { InternalWritablePlayerProp, InternalWritablePlayerProps } from './PlayerProps';

export type PlayerStateChange = {
  by: string,
  prop: InternalWritablePlayerProp,
  value: any
};

export type PlayerStateDispatcher = <P extends keyof InternalWritablePlayerProps>(
  prop: P,
  value: InternalWritablePlayerProps[P]
) => void;

export const createPlayerStateDispatcher = (
  el: HTMLElement,
): PlayerStateDispatcher => (prop: any, value: any) => {
  const event = new CustomEvent<PlayerStateChange>('vStateChange', {
    bubbles: true,
    detail: { by: el.nodeName, prop, value },
  });

  el.dispatchEvent(event);
};
