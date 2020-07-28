import { openWormhole } from 'stencil-wormhole';
import { ComponentInterface } from '@stencil/core';
import { PlayerProp } from './PlayerProp';

export const openPlayerWormhole = (
  Component: ComponentInterface,
  props: PlayerProp[],
) => openWormhole(Component as any, props);
