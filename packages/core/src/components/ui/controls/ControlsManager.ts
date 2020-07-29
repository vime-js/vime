import { getElement } from '@stencil/core';
import { HTMLStencilElement } from '@stencil/core/internal';
import { ViewType } from '../../core/player/ViewType';
import { createPlayerStateDispatcher, PlayerStateDispatcher } from '../../core/player/PlayerState';
import { listen } from '../../../utils/dom';
import { Disposal } from '../../core/player/Disposal';
import { PlayerProp } from '../../core/player/PlayerProp';

export class ControlsManager {
  private dispatch?: PlayerStateDispatcher;

  private hideControlsTimeout?: number;

  private disposal = new Disposal();

  private isEnabled = false;

  private isPaused = true;

  private hasPlaybackStarted = false;

  private view?: ViewType;

  set enabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.onControlsChange();
  }

  set paused(paused: boolean) {
    this.isPaused = paused;
    this.onControlsChange();
  }

  set viewType(viewType: ViewType | undefined) {
    this.view = viewType;
    this.onControlsChange();
  }

  set playbackStarted(started: boolean) {
    this.hasPlaybackStarted = started;
    this.onControlsChange();
  }

  constructor(
    ref?: any,
    private readonly duration = 2500,
    private readonly showsControlsBeforePlaybackStart = true,
    private readonly lockControlsWhenPaused = true,
    private readonly hideControlsOnMouseLeave = true,
  ) {
    const el = getElement(ref);
    this.dispatch = createPlayerStateDispatcher(ref);

    let player = el;
    while (player?.nodeName !== 'VIME-PLAYER') {
      player = player.parentNode as HTMLStencilElement;
    }

    const events = ['focus', 'keydown', 'click', 'mousemove', 'touchstart', 'mouseleave'];
    events.forEach((event) => {
      this.disposal.add(listen(player, event, this.onControlsChange.bind(this)));
    });
  }

  private show() {
    this.dispatch!(PlayerProp.IsControlsActive, true);
  }

  private hide() {
    this.dispatch!(PlayerProp.IsControlsActive, false);
  }

  private hideWithDelay() {
    window.requestAnimationFrame(() => {
      this.hideControlsTimeout = window.setTimeout(() => {
        this.hide();
      }, this.duration);
    });
  }

  onControlsChange(e?: Event) {
    window.clearTimeout(this.hideControlsTimeout);

    if (!this.isEnabled) {
      this.hide();
      return;
    }

    if (this.view === ViewType.Audio) {
      this.show();
      return;
    }

    if (this.view !== ViewType.Video) {
      this.hide();
      return;
    }

    if (this.showsControlsBeforePlaybackStart && !this.hasPlaybackStarted) {
      this.show();
      return;
    }

    if (!this.showsControlsBeforePlaybackStart && !this.hasPlaybackStarted) {
      this.hide();
      return;
    }

    if (
      (e?.type === 'mouseleave')
      && this.hideControlsOnMouseLeave
      && !(this.lockControlsWhenPaused && this.isPaused)
    ) {
      this.hide();
      return;
    }

    if (!this.isPaused || !this.lockControlsWhenPaused) {
      this.show();
      this.hideWithDelay();
      return;
    }

    (this.isPaused) ? this.show() : this.hide();
  }

  destroy() {
    this.disposal.empty();
    this.dispatch = undefined;
  }
}
