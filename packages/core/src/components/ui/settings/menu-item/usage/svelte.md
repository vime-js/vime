```html {6,16} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Settings>
      <MenuItem label="Playback Quality" hint="Auto" />
    </Settings>
  </Ui>
</Player>

<script lang="ts">
  import { Player, Ui, Settings, MenuItem } from '@vime/svelte';
</script>
```
