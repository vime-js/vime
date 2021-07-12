```html {7-11} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-settings>
      <vm-submenu label="Playback Rate">
        <vm-menu-radio-group [value]="value" (vmCheck)="onValueChange($event)">
          <vm-menu-radio label="0.5" value="0.5" />
          <vm-menu-radio label="Normal" value="1" />
          <vm-menu-radio label="2" value="2" />
        </vm-menu-radio-group>
      </vm-submenu>
    </vm-settings>
  </vm-ui>
</vm-player>
```

```ts title="example.ts"
import { MenuRadio } from '@vime/angular';

class Example {
  value = '1';

  onValueChange(event: Event) {
    const radio = event.target as MenuRadio;
    this.value = radio.value;
  }
}
```
