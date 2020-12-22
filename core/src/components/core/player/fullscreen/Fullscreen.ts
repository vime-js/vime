import { getFullscreenApi } from './FullscreenApi';
import { isUndefined } from '../../../../utils/unit';
import { listen } from '../../../../utils/dom';
import { Disposal } from '../../../../utils/Disposal';

export class Fullscreen {
  private disposal = new Disposal();

  private api = getFullscreenApi();

  constructor(
    private readonly el: HTMLElement,
    private readonly listener: (isActive: boolean) => void,
  ) {
    if (this.isSupported) {
      this.disposal.add(listen(
        document,
        this.api.fullscreenchange!,
        this.onFullscreenChange.bind(this),
      ));

      /* *
       * We have to listen to this on webkit, because no `fullscreenchange` event is fired when the
       * video element enters or exits fullscreen by:
       *
       *  1. Clicking the native Html5 fullscreen video control.
       *  2. Calling requestFullscreen from the video element directly.
       *  3. Calling requestFullscreen inside an iframe.
       * */
      if ((document as any).webkitExitFullscreen) {
        this.disposal.add(listen(
          document,
          'webkitfullscreenchange',
          this.onFullscreenChange.bind(this),
        ));
      }

      // We listen to this for the same reasons as above except when the browser is Firefox.
      if ((document as any).mozCancelFullScreen) {
        this.disposal.add(listen(
          document,
          'mozfullscreenchange',
          this.onFullscreenChange.bind(this),
        ));
      }
    }
  }

  async enterFullscreen(options?: FullscreenOptions) {
    if (!this.isSupported) throw Error('Fullscreen API is not available.');
    return (this.el as any)[this.api.requestFullscreen!](options);
  }

  async exitFullscreen() {
    if (!this.isSupported) throw Error('Fullscreen API is not available.');
    if (!this.isActive) throw Error('Player is not currently in fullscreen mode to exit.');
    return (document as any)[this.api.exitFullscreen!]();
  }

  get isActive() {
    if (!this.isSupported) return false;
    const fullscreenEl = (document as any)[this.api.fullscreenElement!] as Document['fullscreenElement'];
    return (this.el === fullscreenEl)
      || this.el.matches(`:${this.api.fullscreen}`)
      || this.el.contains(fullscreenEl);
  }

  get isSupported() {
    return !isUndefined(this.api.requestFullscreen);
  }

  onFullscreenChange() {
    this.listener(this.isActive);
  }

  destroy() {
    this.disposal.empty();
  }
}
