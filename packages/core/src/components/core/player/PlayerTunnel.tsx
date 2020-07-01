import { h } from '@stencil/core';
import { createProviderConsumer } from '@stencil/state-tunnel';
import { PlayerProps } from './PlayerProps';

export const PlayerTunnel = createProviderConsumer<PlayerProps>({} as any,
  (subscribe, child) => (
    <context-consumer subscribe={subscribe} renderer={child} />
  ));
