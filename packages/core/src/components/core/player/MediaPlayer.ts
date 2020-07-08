import { ComponentInterface } from '@stencil/core';
import { PlayerProps } from './PlayerProp';
import { PlayerEvents } from './PlayerEvent';
import { PlayerMethods } from './PlayerMethod';

/**
 * The core media player interface.
 *
 * @ref https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
 */
export interface MediaPlayer extends ComponentInterface, PlayerProps, PlayerEvents, PlayerMethods {}
