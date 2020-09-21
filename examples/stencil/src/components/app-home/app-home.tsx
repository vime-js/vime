import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  // Obtain a ref if you need to call any methods.
  private player!: HTMLVimePlayerElement;

  private onPlaybackReady() {
    // ...
  }

  render() {
    return (
      <div class="container">
        <vime-player
          playsinline
          onVPlaybackReady={this.onPlaybackReady.bind(this)}
          ref={(el) => { this.player = el; }}
        >
          <vime-video poster="https://media.vimejs.com/poster.png">
            <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
          </vime-video>

          <vime-default-ui>
            {/* Custom UI Component. */}
            <tap-sides-to-seek />
          </vime-default-ui>
        </vime-player>
      </div>
    );
  }
}
