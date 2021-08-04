import { Component, h, Prop, State, Watch } from '@stencil/core';

import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import { isNil, isUndefined } from '../../../utils/unit';
import { findPlayer } from '../../core/player/findPlayer';
import {
  createDispatcher,
  Dispatcher,
} from '../../core/player/PlayerDispatcher';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { withControlsCollisionDetection } from '../controls/controls/withControlsCollisionDetection';

/**
 * Renders and displays VTT cues by hooking into the `textTracks` player property. This is a simple
 * implementation that can only handle rendering one text track, and one cue for the given track at a
 * time (even if many are active). The active track can be changed by setting the mode of any track
 * in the list to `showing`.
 *
 * Be aware that after you set the text track mode to `showing`, the component will automatically set
 * it to hidden to avoid double captions. This also means that this component is **not recommended**
 * to be used in combination with the native HTML5 player controls.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/captions/captions.png"
 *   alt="Vime captions component"
 * />
 */
@Component({
  tag: 'vm-captions',
  styleUrl: 'captions.css',
  shadow: true,
})
export class Captions {
  private dispatch!: Dispatcher;

  private sizeDisposal = new Disposal();

  private textDisposal = new Disposal();

  @State() isEnabled = false;

  @State() cue?: string;

  @State() fontSize: 'sm' | 'md' | 'lg' | 'xl' = 'sm';

  /**
   * Whether the captions should be visible or not.
   */
  @Prop() hidden = false;

  /** @internal */
  @Prop() isControlsActive: PlayerProps['isControlsActive'] = false;

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /** @internal */
  @Prop() playbackStarted: PlayerProps['playbackStarted'] = false;

  @Watch('isVideoView')
  @Watch('playbackStarted')
  onEnabledChange() {
    this.isEnabled = this.playbackStarted && this.isVideoView;
  }

  /** @internal */
  @Prop() textTracks: PlayerProps['textTracks'] = [];

  /** @internal */
  @Prop() currentTextTrack: PlayerProps['currentTextTrack'] = -1;

  /** @internal */
  @Prop() isTextTrackVisible: PlayerProps['isTextTrackVisible'] = true;

  @Watch('textTracks')
  @Watch('currentTextTrack')
  onTextTracksChange() {
    const textTrack = this.textTracks[this.currentTextTrack];

    const renderCues = () => {
      const activeCues = Array.from(textTrack.activeCues ?? []);
      this.renderCurrentCue(activeCues[0] as VTTCue);
    };

    this.textDisposal.empty();

    if (!isNil(textTrack)) {
      renderCues();
      this.textDisposal.add(listen(textTrack, 'cuechange', renderCues));
    }
  }

  constructor() {
    withComponentRegistry(this);
    withControlsCollisionDetection(this);
    withPlayerContext(this, [
      'isVideoView',
      'playbackStarted',
      'isControlsActive',
      'textTracks',
      'currentTextTrack',
      'isTextTrackVisible',
    ]);
  }

  connectedCallback() {
    this.dispatch = createDispatcher(this);
    this.dispatch('shouldRenderNativeTextTracks', false);
    this.onTextTracksChange();
    this.onPlayerResize();
  }

  disconnectedCallback() {
    this.textDisposal.empty();
    this.sizeDisposal.empty();
    this.dispatch('shouldRenderNativeTextTracks', true);
  }

  private async onPlayerResize() {
    const player = await findPlayer(this);

    if (isUndefined(player)) return;

    const container = (await player.getContainer()) as HTMLDivElement;

    const resizeObs = new ResizeObserver(entries => {
      const entry = entries[0];
      const { width } = entry.contentRect;
      if (width >= 1360) {
        this.fontSize = 'xl';
      } else if (width >= 1024) {
        this.fontSize = 'lg';
      } else if (width >= 768) {
        this.fontSize = 'md';
      } else {
        this.fontSize = 'sm';
      }
    });

    resizeObs.observe(container);
  }

  private renderCurrentCue(cue?: VTTCue) {
    if (isNil(cue)) {
      this.cue = '';
      return;
    }

    const div = document.createElement('div');
    div.append(cue.getCueAsHTML());
    this.cue = div.innerHTML.trim();
  }

  render() {
    return (
      <div
        style={{
          transform: `translateY(calc(${
            this.isControlsActive ? 'var(--vm-controls-height)' : '24px'
          } * -1))`,
        }}
        class={{
          captions: true,
          enabled: this.isEnabled,
          hidden: this.hidden,
          fontMd: this.fontSize === 'md',
          fontLg: this.fontSize === 'lg',
          fontXl: this.fontSize === 'xl',
          inactive: !this.isTextTrackVisible,
        }}
      >
        <span class="cue">{this.cue}</span>
      </div>
    );
  }
}
