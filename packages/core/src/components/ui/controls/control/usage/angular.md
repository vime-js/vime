```html title="playback-control.html"
<vime-control
  keys="k"
  [label]="i18n.playback"
  [pressed]="paused"
  (click)="onClick()"
>
  <vime-icon [href]="icon"></vime-icon>
  <vime-tooltip>{{tooltip}} (k)</vime-tooltip>
</vime-control>
```

```ts title="playback-control.ts"
import { Component, ElementRef } from '@angular/core';
import { PlayerProp, VimeComponent } from '@vime/angular';

@Component({
  selector: 'playback-control',
  templateUrl: './playback-control.html',
})
class PlaybackControl extends VimeComponent {
  paused = true;

  i18n = {};

  constructor(protected ref: ElementRef) {
    super([PlayerProp.paused, PlayerProp.i18n]);
  }

  get icon() {
    return this.paused ? '#vime-play' : '#vime-pause';
  }

  get tooltip() {
    return this.paused ? this.i18n.play : this.i18n.pause;
  }

  onClick() {
    this.paused = !this.paused;
  }
}
```
