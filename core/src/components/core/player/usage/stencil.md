```tsx
import { h } from '@stencil/core';

class Example {
  private player!: HTMLVmPlayerElement;

  @State() currentTime = 0;
  
  // Example method to showcase updating property.
  private seekForward() {
    this.currentTime += 5;
  };

  // Example method to showcase calling player method.
  private enterFullscreen() {
    this.player.enterFulllscreen();
  };

  private onTimeUpdate(event: CustomEvent<number>) {
    this.currentTime = event.detail;
  };

  private onFullscreenChange(event: CustomEvent<boolean>) {
    const isFullscreen = event.detail;
    // ...
  };

  render() {
    return (
      <vm-player
        controls
        autoplay
        muted
        currentTime={this.currentTime}
        onVmCurrentTimeChange={this.onTimeUpdate.bind(this)}
        onVmFullscreenChange={this.onFullscreenChange.bind(this)}
        ref={(el) => { this.player = el; }}
      >
        {/* Provider component is placed here. */}

        <vm-ui>{/* UI components are placed here. */}</vm-ui>
      </vm-player>
    );
  }
}
```