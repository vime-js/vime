import { ComponentInterface } from '@stencil/core';
import { PlayerProps } from './PlayerProps';
import { PlayerEvents } from './PlayerEvents';
import { PlayerMethods } from './PlayerMethods';

type Indexable = { [P in keyof PlayerProps]: PlayerProps[P] };

/**
 * The core media player interface.
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export interface MediaPlayer extends
  ComponentInterface,
  PlayerProps,
  PlayerEvents,
  PlayerMethods,
  Indexable {}
