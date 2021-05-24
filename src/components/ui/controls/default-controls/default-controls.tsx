import { Component, Fragment, h, Prop } from '@stencil/core';

import { PlayerProps } from '../../../core/player/PlayerProps';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../../core/player/withPlayerContext';

/**
 * Default set of controls for when you're in a hurry. The controls displayed depend on whether the
 * media is audio/video/live, and whether the device is mobile/desktop. See
 * [`vime-default-ui`](../default-ui.md) for visuals.
 */
@Component({
  tag: 'vm-default-controls',
  styleUrl: 'default-controls.css',
  shadow: true,
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

  /** @internal */
  @Prop() theme?: PlayerProps['theme'];

  /** @internal */
  @Prop() isMobile: PlayerProps['isMobile'] = false;

  /** @internal */
  @Prop() isLive: PlayerProps['isLive'] = false;

  /** @internal */
  @Prop() isAudioView: PlayerProps['isAudioView'] = false;

  /** @internal */
  @Prop() isVideoView: PlayerProps['isVideoView'] = false;

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, [
      'theme',
      'isMobile',
      'isAudioView',
      'isVideoView',
      'isLive',
    ]);
  }

  private buildAudioControls() {
    return (
      <vm-controls fullWidth>
        <vm-playback-control tooltipDirection="right" />
        <vm-volume-control />
        {!this.isLive && <vm-current-time />}
        {this.isLive && <vm-control-spacer />}
        {!this.isLive && <vm-scrubber-control />}
        {this.isLive && <vm-live-indicator />}
        {!this.isLive && <vm-end-time />}
        {!this.isLive && <vm-settings-control tooltipDirection="left" />}
        <div style={{ marginLeft: '0', paddingRight: '2px' }} />
      </vm-controls>
    );
  }

  private buildMobileVideoControls() {
    return (
      <Fragment>
        <vm-scrim gradient="up" />

        <vm-controls
          pin="topLeft"
          fullWidth
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
        >
          <vm-control-spacer />
          <vm-volume-control />
          {!this.isLive && <vm-caption-control />}
          {!this.isLive && <vm-settings-control />}
          {this.isLive && <vm-fullscreen-control />}
        </vm-controls>

        <vm-controls
          pin="center"
          justify="center"
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
        >
          <vm-playback-control style={{ '--vm-control-scale': '1.3' }} />
        </vm-controls>

        {!this.isLive && (
          <vm-controls
            pin="bottomLeft"
            fullWidth
            activeDuration={this.activeDuration}
            waitForPlaybackStart={this.waitForPlaybackStart}
            hideWhenPaused={this.hideWhenPaused}
          >
            <vm-control-group>
              <vm-current-time />
              <vm-control-spacer />
              <vm-end-time />
              <vm-fullscreen-control />
            </vm-control-group>

            <vm-control-group space="top">
              <vm-scrubber-control />
            </vm-control-group>
          </vm-controls>
        )}
      </Fragment>
    );
  }

  private buildDesktopVideoControls() {
    return (
      <Fragment>
        {this.theme !== 'light' && <vm-scrim gradient="up" />}

        <vm-controls
          fullWidth
          pin="bottomRight"
          activeDuration={this.activeDuration}
          waitForPlaybackStart={this.waitForPlaybackStart}
          hideWhenPaused={this.hideWhenPaused}
          hideOnMouseLeave={this.hideOnMouseLeave}
        >
          {!this.isLive && (
            <vm-control-group>
              <vm-scrubber-control />
            </vm-control-group>
          )}

          <vm-control-group space={this.isLive ? 'none' : 'top'}>
            <vm-playback-control tooltipDirection="right" />
            <vm-volume-control />
            {!this.isLive && <vm-time-progress />}
            <vm-control-spacer />
            {!this.isLive && <vm-caption-control />}
            {this.isLive && <vm-live-indicator />}
            <vm-pip-control />
            {!this.isLive && <vm-settings-control />}
            <vm-fullscreen-control tooltipDirection="left" />
          </vm-control-group>
        </vm-controls>
      </Fragment>
    );
  }

  render() {
    if (this.isAudioView) return this.buildAudioControls();
    if (this.isVideoView && this.isMobile)
      return this.buildMobileVideoControls();
    if (this.isVideoView) return this.buildDesktopVideoControls();
    return null;
  }
}
