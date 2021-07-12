```html title="example.html"
<vm-player
  #player
  autoplay
  muted
  [currentTime]="currentTime"
  (vmCurrentTimeChange)="onTimeUpdate($event)"
  (vmFullscreenChange)="onFullscreenChange($event)"
>
  <!-- Provider component is placed here. -->

  <vm-ui>
    <!-- UI components are placed here. -->
  </vm-ui>
</vm-player>
```

```ts title="example.ts"
import { ViewChild } from '@angular/core';
import { Player } from '@vime/angular';

class Example {
  @ViewChild('player') player!: Player;

  currentTime = 0;

  // Example function to showcase updating property.
  seekForward() {
    this.currentTime += 5;
  }

  // Example function to showcase calling player method.
  enterFullscreen() {
    this.player.enterFullscreen();
  }

  onTimeUpdate(event: CustomEvent<number>) {
    this.currentTime = event.detail;
  }

  onFullscreenChange(event: CustomEvent<boolean>) {
    const isFullscreen = event.detail;
    // ...
  }
}
```
