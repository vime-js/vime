```tsx {7-11}
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeSettings>
      <VimeSubmenu label="Playback Rate">
        <VimeMenuRadioGroup value={value} on:vCheck={onValueChange}>
          <VimeMenuRadio label="0.5" value="0.5" />
          <VimeMenuRadio label="Normal" value="1" />
          <VimeMenuRadio label="2" value="2" />
        </VimeMenuRadioGroup>
      </VimeSubmenu>
    </VimeSettings>
  </VimeUi>
</VimePlayer>
```

```html {7}
<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeSettings,
    VimeSubmenu,
    VimeMenuRadioGroup,
    VimeMenuRadio,
  } from '@vime/svelte';

  let value = '1';

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVimeMenuRadioElement;
    value = radio.value;
  };
</script>
```
