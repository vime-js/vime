```html {6,16} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls>
      <MuteControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import {
    Player,
    Ui,
    Controls,
    MuteControl,
  } from '@vime/svelte';
</script>
```
