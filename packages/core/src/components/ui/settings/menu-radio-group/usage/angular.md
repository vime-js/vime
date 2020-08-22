```html {7-11} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-settings>
      <vime-submenu label="Playback Rate">
        <vime-menu-radio-group value="1" (vCheck)="onValueChange($event)">
          <vime-menu-radio label="0.5" value="0.5" />
          <vime-menu-radio label="Normal" value="1" />
          <vime-menu-radio label="2" value="2" />
        </vime-menu-radio-group>
      </vime-submenu>
    </vime-settings>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
class Example {
  currentValue = 1;

  onValueChange(event: Event) {
    const radio = event.target as HTMLVimeMenuRadioElement;
    this.currentValue = parseFloat(radio.value);
  }
}
```
