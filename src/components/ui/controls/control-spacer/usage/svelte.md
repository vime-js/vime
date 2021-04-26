```html {8,21} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls fullWidth>
      <PlaybackControl />
      <VolumeControl />
      <ControlSpacer />
      <FullscreenControl />
    </Controls>
  </Ui>
</Player>

<script lang="ts">
  import {
    Player,
    Ui,
    Controls,
    PlaybackControl,
    VolumeControl,
    ControlSpacer,
    FullscreenControl,
  } from '@vime/svelte';
</script>
```
