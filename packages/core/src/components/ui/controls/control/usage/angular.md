```html {6-14} title="example.html"
<vime-player [paused]="paused" (vPausedChange)="onPausedChange($event)">
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls full-width>
      <vime-control
        label="Playback"
        keys="k"
        [pressed]="paused"
        (click)="onClick"
      >
        <vime-icon [href]="icon"></vime-icon>
        <vime-tooltip>{{tooltip}} (k)</vime-tooltip>
      </vime-control>
    </vime-controls>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
class Example {
  paused = true;

  icon = '#vime-play';

  tooltip = 'Play';

  onClick() {
    this.onPausedChange({ detail: !this.paused });
  }

  onPausedChange(event: CustomEvent<boolean>) {
    this.paused = event.detail;
    this.tooltip = this.paused ? 'Play' : 'Pause';
    this.icon = this.paused ? '#vime-play' : '#vime-pause';
  }
}
```
