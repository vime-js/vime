```html {8-10,24} title="example.svelte"
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeSettings>
      <VimeSubmenu label="Playback Rate">
        <VimeMenuRadioGroup value="1">
          <VimeMenuRadio label="0.5" value="0.5" />
          <VimeMenuRadio label="Normal" value="1" />
          <VimeMenuRadio label="2" value="2" />
        </VimeMenuRadioGroup>
      </VimeSubmenu>
    </VimeSettings>
  </VimeUi>
</VimePlayer>

<script lang="ts">
  import {
    VimePlayer,
    VimeUi,
    VimeSettings,
    VimeSubmenu,
    VimeMenuRadioGroup,
    VimeMenuRadio,
  } from '@vime/svelte';
</script>
```
