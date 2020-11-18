```tsx {7-11}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Settings>
      <Submenu label="Playback Rate">
        <MenuRadioGroup value={value} on:vmCheck={onValueChange}>
          <MenuRadio label="0.5" value="0.5" />
          <MenuRadio label="Normal" value="1" />
          <MenuRadio label="2" value="2" />
        </MenuRadioGroup>
      </Submenu>
    </Settings>
  </Ui>
</Player>
```

```html {7}
<script lang="ts">
  import {
    Player,
    Ui,
    Settings,
    Submenu,
    MenuRadioGroup,
    MenuRadio,
  } from '@vime/svelte';

  let value = '1';

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
    value = radio.value;
  };
</script>
```
