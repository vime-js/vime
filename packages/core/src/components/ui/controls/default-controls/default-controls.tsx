import {
  h, Host, Component, Prop,
} from '@stencil/core';
import { openPlayerWormhole } from '../../../core/player/PlayerWormhole';
import { PlayerProp, PlayerProps } from '../../../core/player/PlayerProp';

@Component({
  tag: 'vime-default-controls',
  styleUrl: 'default-controls.css',
})
export class DefaultControls {
  /**
   * The length in milliseconds that the controls are active for before fading out. Audio players
   * are not effected by this prop.
   */
  @Prop() activeDuration = 2750;

  /**
   * Whether the controls should wait for playback to start before being shown. Audio players
   * are not effected by this prop.
   */
  @Prop() waitForPlaybackStart = false;

  /**
   * Whether the controls should show/hide when paused. Audio players are not effected by this prop.
   */
  @Prop() hideWhenPaused = false;

  /**
   * Whether the controls should hide when the mouse leaves the player. Audio players are not
   * effected by this prop.
   */
  @Prop() hideOnMouseLeave = false;

  /**
   * @internal
   */
  @Prop() isMobile: PlayerProps[PlayerProp.IsMobile] = false;

  /**
   * @internal
   */
  @Prop() isLive: PlayerProps[PlayerProp.IsLive] = false;

  /**
   * @internal
   */
  @Prop() isAudioView: PlayerProps[PlayerProp.IsAudioView] = false;

  /**
   * @internal
   */
  @Prop() isVideoView: PlayerProps[PlayerProp.IsVideoView] = false;

  private buildAudioControls() {
    return (
      <vime-controls full-width>
        <vime-playback-control tooltip-direction="right" />
        <vime-volume-control />
        {!this.isLive && <vime-current-time />}
        {this.isLive && <vime-control-spacer />}
        {!this.isLive && <vime-scrubber-control /> }
        {this.isLive && <vime-live-indicator />}
        {!this.isLive && <vime-end-time />}
        {!this.isLive && <vime-settings-control tooltip-direction="left" />}
        <div style={{ paddingRight: '2px' }} />
      </vime-controls>
    );
  }

  private buildMobileVideoControls() {
    const lowerControls = (
      <vime-controls
        pin="bottomLeft"
        full-width
        activeDuration={this.activeDuration}
        waitForPlaybackStart={this.waitForPlaybackStart}
        hideWhenPaused={this.hideWhenPaused}
      >
        <vime-control-group>
          <vime-current-time />
          <vime-control-spacer />
          <vime-end-time />
          <vime-fullscreen-control />
        </vime-control-group>

        <vime-control-group space="top">
          <vime-scrubber-control />
        </vime-control-group>
      </vime-controls>
    );

    return (
      <Host>
        <vime-scrim />

        <vime-controls
          pin="topLeft"
          full-width
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
        >
          <vime-control-spacer />
          <vime-volume-control />
          {!this.isLive && <vime-caption-control />}
          {!this.isLive && <vime-settings-control />}
          {this.isLive && <vime-fullscreen-control />}
        </vime-controls>

        <vime-controls
          pin="center"
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
        >
          <vime-playback-control scale={1.5} />
        </vime-controls>

        {!this.isLive && lowerControls}
      </Host>
    );
  }

  private buildDesktopVideoControls() {
    const scrubberControlGroup = (
      <vime-control-group>
        <vime-scrubber-control />
      </vime-control-group>
    );

    return (
      <Host>
        <vime-scrim gradient="up" />

        <vime-controls
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
          hideOnMouseLeave={this.hideOnMouseLeave}
          full-width
        >
          {!this.isLive && scrubberControlGroup}

          <vime-control-group space={this.isLive ? 'none' : 'top'}>
            <vime-playback-control tooltip-direction="right" />
            <vime-volume-control />
            {!this.isLive && <vime-time-progress />}
            <vime-control-spacer />
            {!this.isLive && <vime-caption-control />}
            {this.isLive && <vime-live-indicator />}
            <vime-pip-control />
            {!this.isLive && <vime-settings-control />}
            <vime-fullscreen-control tooltip-direction="left" />
          </vime-control-group>
        </vime-controls>
      </Host>
    );
  }

  render() {
    if (this.isAudioView) return this.buildAudioControls();
    if (this.isVideoView && this.isMobile) return this.buildMobileVideoControls();
    if (this.isVideoView) return this.buildDesktopVideoControls();
    return undefined;
  }
}

openPlayerWormhole(DefaultControls, [
  PlayerProp.IsMobile,
  PlayerProp.IsAudioView,
  PlayerProp.IsVideoView,
  PlayerProp.IsLive,
]);
