import { HTMLStencilElement } from '@stencil/core/internal';
import mitt, { Handler } from 'mitt';

import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { IS_IOS, WebKitPresentationMode } from '../../../utils/support';
import { isFunction, isNil, noop } from '../../../utils/unit';

export interface VideoPresentationControllerHost extends HTMLStencilElement {
  readonly mediaEl: HTMLMediaElement | undefined;
  disconnectedCallback?: () => void;
}

export interface VideoPresentationEventPayload {
  change: WebKitPresentationMode;
}

/**
 * Contains the logic for handling presentation modes on Safari. This class is used by
 * the `VideoFullscreenController` as a fallback when the native Fullscreen API is not
 * available (ie: iOS Safari).
 */
export class VideoPresentationController {
  protected disposal = new Disposal();

  protected emitter = mitt();

  constructor(protected host: VideoPresentationControllerHost) {
    const disconnectedCallback = host.disconnectedCallback;
    host.disconnectedCallback = async () => {
      await this.destroy();
      disconnectedCallback?.call(host);
    };
  }

  get videoElement(): HTMLVideoElement | undefined {
    if (this.host.mediaEl?.tagName.toLowerCase() === 'video') {
      return this.host.mediaEl as HTMLVideoElement;
    }

    return undefined;
  }

  /**
   * The current presentation mode, possible values include `inline`, `picture-in-picture` and
   * `fullscreen`. Only available in Safari.
   *
   * @default undefined
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get presentationMode(): WebKitPresentationMode | undefined {
    return this.videoElement?.webkitPresentationMode;
  }

  /**
   * Whether the current `presentationMode` is `inline`.
   */
  get isInlineMode(): boolean {
    return this.presentationMode === 'inline';
  }

  /**
   * Whether the current `presentationMode` is `picture-in-picture`.
   */
  get isPictureInPictureMode(): boolean {
    return this.presentationMode === 'inline';
  }

  /**
   * Whether the current `presentationMode` is `fullscreen`.
   */
  get isFullscreenMode(): boolean {
    return this.presentationMode === 'fullscreen';
  }

  /**
   * Whether the presentation mode API is available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1628805-webkitsupportsfullscreen
   */
  get isSupported(): boolean {
    return (
      IS_IOS &&
      isFunction(this.videoElement?.webkitSetPresentationMode) &&
      (this.videoElement?.webkitSupportsFullscreen ?? false)
    );
  }

  setPresentationMode(mode: WebKitPresentationMode): void {
    this.videoElement?.webkitSetPresentationMode?.(mode);
  }

  on<EventType extends keyof VideoPresentationEventPayload>(
    type: EventType,
    handler: Handler<VideoPresentationEventPayload[EventType]>,
  ): void {
    this.emitter.on(type, handler);
  }

  off<EventType extends keyof VideoPresentationEventPayload>(
    type: EventType,
    handler: Handler<VideoPresentationEventPayload[EventType]>,
  ): void {
    this.emitter.off(type, handler);
  }

  destroy(): void {
    this.setPresentationMode('inline');
    this.disposal.empty();
  }

  addPresentationModeChangeEventListener(): () => void {
    if (!this.isSupported || isNil(this.videoElement)) return noop;
    return listen(
      this.videoElement,
      'webkitpresentationmodechanged',
      this.handlePresentationModeChange.bind(this),
    );
  }

  protected handlePresentationModeChange(): void {
    this.emitter.emit('change', this.presentationMode);
  }
}
