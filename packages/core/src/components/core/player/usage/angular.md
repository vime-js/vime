```html title="example.html"
<vime-player
  #player
  autoplay
  muted
  [currentTime]="currentTime"
  (vCurrentTimeChange)="onTimeUpdate($event)"
  (vFullscreenChange)="onFullscreenChange($event)"
>
  <!-- Provider component is placed here. -->

  <vime-ui>
    <!-- UI components are placed here. -->
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
import { ViewChild } from '@angular/core';

class Example {
  @ViewChild('player') player!: HTMLVimePlayerElement;

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
