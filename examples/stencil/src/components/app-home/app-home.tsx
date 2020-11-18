import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  // Obtain a ref if you need to call any methods.
  private player!: HTMLVmPlayerElement;

  private onPlaybackReady() {
    // ...
  }

  render() {
    return (
      <div class="container">
        <vm-player
          playsinline
          onVmPlaybackReady={this.onPlaybackReady.bind(this)}
          ref={(el) => { this.player = el; }}
        >
          <vm-video poster="https://media.vimejs.com/poster.png">
            <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
          </vm-video>

          <vm-default-ui>
            {/* Custom UI Component. */}
            <tap-sides-to-seek />
          </vm-default-ui>
        </vm-player>
      </div>
    );
  }
}
