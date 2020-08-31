import {
  h, Component, Prop, Watch, Host, State, Event, EventEmitter,
} from '@stencil/core';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { Disposal } from '../../core/player/Disposal';
import { isUndefined } from '../../../utils/unit';
import { listen } from '../../../utils/dom';

@Component({
  tag: 'vime-captions',
  styleUrl: 'captions.scss',
})
export class Captions {
  private textTracksDisposal = new Disposal();

  private textTrackDisposal = new Disposal();

  private state = new Map<TextTrack, TextTrackMode>();

  @State() isEnabled = false;

  @State() activeTrack?: TextTrack;

  @Watch('activeTrack')
  onActiveTrackChange() {
    this.vTrackChange.emit(this.activeTrack);
  }

  @State() activeCues: TextTrackCue[] = [];

  @Watch('activeCues')
  onActiveCuesChange() {
    this.vCuesChange.emit(this.activeCues);
  }

  /**
   * Whether the captions should be visible or not.
   */
  @Prop() hidden = false;

  /**
   * The height of any lower control bar in pixels so that the captions can reposition when it's
   * active.
   */
  @Prop() controlsHeight = 0;

  /**
   * @internal
   */
  @Prop() isControlsActive: PlayerProps['isControlsActive'] = false;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  /**
   * @internal
   */
  @Prop() playbackStarted: PlayerProps['playbackStarted'] = false;

  /**
   * @internal
   */
  @Prop() textTracks?: PlayerProps['textTracks'];

  /**
   * Emitted when the current track changes.
   */
  @Event({ bubbles: false }) vTrackChange!: EventEmitter<TextTrack | undefined>;

  /**
   * Emitted when the active cues change. A cue is active when
   * `currentTime >= cue.startTime && currentTime <= cue.endTime`.
   */
  @Event({ bubbles: false }) vCuesChange!: EventEmitter<TextTrackCue[]>;

  disconnectedCallback() {
    this.cleanup();
  }

  private cleanup() {
    this.state.clear();
    this.textTracksDisposal.empty();
    this.textTrackDisposal.empty();
  }

  private onCueChange() {
    this.activeCues = Array.from(this.activeTrack?.activeCues ?? []);
  }

  private onTrackChange() {
    this.activeCues = [];
    this.textTrackDisposal.empty();
    if (isUndefined(this.activeTrack)) return;
    this.textTrackDisposal.add(listen(this.activeTrack!, 'cuechange', this.onCueChange.bind(this)));
  }

  private findActiveTrack() {
    let activeTrack: TextTrack;

    Array.from(this.textTracks!).forEach((track) => {
      if (isUndefined(activeTrack) && (track.mode === 'showing')) {
        // eslint-disable-next-line no-param-reassign
        track.mode = 'hidden';
        activeTrack = track;
        this.state.set(track, 'hidden');
      } else {
        // eslint-disable-next-line no-param-reassign
        track.mode = 'disabled';
        this.state.set(track, 'disabled');
      }
    });

    return activeTrack!;
  }

  private onTracksChange() {
    let hasChanged = false;

    Array.from(this.textTracks!).forEach((track) => {
      if (!hasChanged) {
        hasChanged = !this.state.has(track) || (track.mode !== this.state.get(track));
      }

      this.state.set(track, track.mode);
    });

    if (hasChanged) {
      const activeTrack = this.findActiveTrack();
      if (this.activeTrack !== activeTrack) {
        this.activeTrack = activeTrack;
        this.onTrackChange();
      }
    }
  }

  @Watch('textTracks')
  onTextTracksListChange() {
    this.cleanup();
    if (isUndefined(this.textTracks)) return;
    this.onTracksChange();
    this.textTracksDisposal.add(listen(this.textTracks!, 'change', this.onTracksChange.bind(this)));
  }

  @Watch('isVideoView')
  @Watch('playbackStarted')
  onEnabledChange() {
    this.isEnabled = this.playbackStarted && this.isVideoView;
  }

  private renderCurrentCue() {
    const currentCue = this.activeCues[0];
    if (isUndefined(currentCue)) return '';
    const div = document.createElement('div');
    div.append((currentCue as VTTCue)!.getCueAsHTML());
    return div.innerHTML.trim();
  }

  render() {
    return (
      <Host
        style={{
          transform: `translateY(-${this.isControlsActive ? this.controlsHeight : 0}px)`,
        }}
        class={{
          enabled: this.isEnabled,
          hidden: this.hidden,
        }}
      >
        <span>{this.renderCurrentCue()}</span>
      </Host>
    );
  }
}

withPlayerContext(Captions, [
  'isVideoView',
  'playbackStarted',
  'isControlsActive',
  'textTracks',
]);
