import fscreen from 'fscreen';
import mitt, { Handler } from 'mitt';

import { Disposal } from '../../../../utils/Disposal';
import { listen } from '../../../../utils/dom';
import { noop } from '../../../../utils/unit';

export interface FullscreenEventPayload {
  change: boolean;
  error: Event;
}

/**
 * Unfortunately fullscreen isn't straight forward due to cross-browser inconsistencies. This
 * class abstract the logic for handling fullscreen across browsers.
 */
export class FullscreenController {
  protected disposal = new Disposal();

  protected emitter = mitt();

  constructor(protected host: HTMLElement) {}

  /**
   * Whether fullscreen mode can be requested, generally is an API available to do so.
   */
  get isSupported(): boolean {
    return this.isSupportedNatively;
  }

  /**
   * Whether the native Fullscreen API is enabled/available.
   */
  get isSupportedNatively(): boolean {
    return fscreen.fullscreenEnabled;
  }

  /**
   * Whether the host element is in fullscreen mode.
   */
  get isFullscreen(): boolean {
    return this.isNativeFullscreen;
  }

  /**
   * Whether the host element is in fullscreen mode via the native Fullscreen API.
   */
  get isNativeFullscreen(): boolean {
    if (fscreen.fullscreenElement === this.host) return true;

    try {
      // Throws in iOS Safari...
      return this.host.matches(
        // Property `fullscreenPseudoClass` is missing from `@types/fscreen`.
        ((fscreen as unknown) as { fullscreenPseudoClass: string })
          .fullscreenPseudoClass,
      );
    } catch (error) {
      return false;
    }
  }

  on<EventType extends keyof FullscreenEventPayload>(
    type: EventType,
    handler: Handler<FullscreenEventPayload[EventType]>,
  ): void {
    this.emitter.on(type, handler);
  }

  off<EventType extends keyof FullscreenEventPayload>(
    type: EventType,
    handler: Handler<FullscreenEventPayload[EventType]>,
  ): void {
    this.emitter.off(type, handler);
  }

  /**
   * Dispose of any event listeners and exit fullscreen (if active).
   */
  async destroy(): Promise<void> {
    if (this.isFullscreen) await this.exitFullscreen();
    this.disposal.empty();
    this.emitter.all.clear();
  }

  protected addFullscreenChangeEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): () => void {
    if (!this.isSupported) return noop;

    return listen(
      (fscreen as unknown) as EventTarget,
      'fullscreenchange',
      handler,
    );
  }

  protected addFullscreenErrorEventListener(
    handler: (this: HTMLElement, event: Event) => void,
  ): () => void {
    if (!this.isSupported) return noop;

    return listen(
      (fscreen as unknown) as EventTarget,
      'fullscreenerror',
      handler,
    );
  }

  async requestFullscreen(): Promise<void> {
    if (this.isFullscreen) return;

    this.throwIfNoFullscreenSupport();

    // TODO: Check if PiP is active, if so make sure to exit - need PipController.

    this.disposal.add(
      this.addFullscreenChangeEventListener(
        this.handleFullscreenChange.bind(this),
      ),
    );

    this.disposal.add(
      this.addFullscreenErrorEventListener(
        this.handleFullscreenError.bind(this),
      ),
    );

    return this.makeEnterFullscreenRequest();
  }

  protected async makeEnterFullscreenRequest(): Promise<void> {
    return fscreen.requestFullscreen(this.host);
  }

  protected handleFullscreenChange(): void {
    if (!this.isFullscreen) this.disposal.empty();
    this.emitter.emit('change', this.isFullscreen);
  }

  protected handleFullscreenError(event: Event): void {
    this.emitter.emit('error', event);
  }

  async exitFullscreen(): Promise<void> {
    if (!this.isFullscreen) return;
    this.throwIfNoFullscreenSupport();
    return this.makeExitFullscreenRequest();
  }

  protected async makeExitFullscreenRequest(): Promise<void> {
    return fscreen.exitFullscreen();
  }

  protected throwIfNoFullscreenSupport(): void {
    if (this.isSupported) return;
    throw Error(
      'Fullscreen API is not enabled or supported in this environment.',
    );
  }
}
