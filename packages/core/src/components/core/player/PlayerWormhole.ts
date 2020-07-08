import { openWormhole, WormholeConsumerConstructor } from 'stencil-wormhole';
import { PlayerProp } from './PlayerProp';

export const openPlayerWormhole = (
  Component: WormholeConsumerConstructor,
  props: PlayerProp[],
) => openWormhole(Component, props);
