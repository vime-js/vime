import { getFullscreenApi } from './FullscreenApi';
import { isUndefined } from '../../../../utils/unit';
import { listen } from '../../../../utils/dom';

export class Fullscreen {
  private dispose: (() => void)[] = [];

  private api = getFullscreenApi();

  constructor(
    private readonly el: HTMLElement,
    private readonly listener: (isActive: boolean) => void,
  ) {
    if (this.isSupported) {
      this.dispose.push(listen(
        document,
        this.api.fullscreenchange!,
        this.onFullscreenChange,
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
        this.dispose.push(listen(
          document,
          'webkitfullscreenchange',
          this.onFullscreenChange,
        ));
      }
    }
  }

  async enterFullscreen(options?: FullscreenOptions) {
    if (!this.isSupported) throw Error('Fullscreen API not available.');
    return (this.el as any)[this.api.requestFullscreen!](options);
  }

  async exitFullscreen() {
    if (!this.isSupported) throw Error('Fullscreen API not available.');
    return (document as any)[this.api.exitFullscreen!]();
  }

  get isActive() {
    if (!this.isSupported) return false;
    const fullscreenEl = (document as any)[this.api.fullscreenElement!] as Document['fullscreenElement'];
    return (this.el === fullscreenEl) || (this.el.matches(`:${this.api.fullscreen}`));
  }

  get isSupported() {
    return !isUndefined(this.api.requestFullscreen);
  }

  onFullscreenChange() {
    this.listener(this.isActive);
  }

  destroy() {
    this.dispose.forEach((fn) => fn());
    this.dispose = [];
  }
}
