import { h, Component, Prop, Watch, State } from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { isNullOrUndefined } from '../../../utils/unit';
import { Disposal } from '../../../utils/Disposal';
import { listen } from '../../../utils/dom';
import {
  createDispatcher,
  Dispatcher,
} from '../../core/player/PlayerDispatcher';
import { withControlsCollisionDetection } from '../controls/controls/withControlsCollisionDetection';
import { findPlayer } from '../../core/player/findPlayer';

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

    if (!isNullOrUndefined(textTrack)) {
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
    const container = await player.getContainer();

    const resizeObs = new ResizeObserver((entries) => {
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

    resizeObs.observe(container!);
  }

  private renderCurrentCue(cue?: VTTCue) {
    if (isNullOrUndefined(cue)) {
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
