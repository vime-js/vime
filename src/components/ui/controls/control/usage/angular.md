```html title="playback-control.html"
<vm-control
  keys="k"
  [label]="i18n.playback"
  [pressed]="paused"
  (click)="onClick()"
>
  <vm-icon [name]="icon"></vm-icon>
  <vm-tooltip>{{tooltip}} (k)</vm-tooltip>
</vm-control>
```

```ts title="playback-control.ts"
import { Component, ElementRef } from '@angular/core';
import { Component } from '@vime/angular';

@Component({
  selector: 'playback-control',
  templateUrl: './playback-control.html',
})
class PlaybackControl extends Component {
  paused = true;

  i18n = {};

  constructor(protected ref: ElementRef) {
    super(['paused', 'i18n']);
  }

  get icon() {
    return this.paused ? 'play' : 'pause';
  }

  get tooltip() {
    return this.paused ? this.i18n.play : this.i18n.pause;
  }

  onClick() {
    this.paused = !this.paused;
  }
}
```
