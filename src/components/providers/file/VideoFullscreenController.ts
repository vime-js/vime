import { noop } from '../../../utils/unit';
import { FullscreenController } from '../../core/player/fullscreen/FullscreenController';
import { VideoPresentationController } from './VideoPresentationController';

/**
 * Extends the base `FullscreenController` with additional logic for handling fullscreen
 * on iOS Safari where the native Fullscreen API is not available (in this case it fallsback to
 * using the `VideoPresentationController`).
 */
export class VideoFullscreenController extends FullscreenController {
  constructor(
    protected host: HTMLElement,
    protected presentationController: VideoPresentationController,
  ) {
    super(host);
  }

  get isFullscreen(): boolean {
    return this.presentationController.isFullscreenMode;
  }

  /**
   * Whether a fallback fullscreen API is available on Safari using presentation modes. This
   * is only used on iOS where the native fullscreen API is not available.
   *
   * @link https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1631913-webkitpresentationmode
   */
  get isSupported(): boolean {
    return this.presentationController.isSupported;
  }

  protected async makeEnterFullscreenRequest(): Promise<void> {
    return this.presentationController.setPresentationMode('fullscreen');
  }

  protected async makeExitFullscreenRequest(): Promise<void> {
    return this.presentationController.setPresentationMode('inline');
  }

  protected addFullscreenChangeEventListener(): () => void {
    if (!this.isSupported) return noop;

    this.presentationController.on(
      'change',
      this.handlePresentationModeChange.bind(this),
    );

    return () => {
      this.presentationController.off(
        'change',
        this.handlePresentationModeChange.bind(this),
      );
    };
  }

  protected handlePresentationModeChange(): void {
    this.handleFullscreenChange();
  }

  protected addFullscreenErrorEventListener(): () => void {
    return noop;
  }
}
