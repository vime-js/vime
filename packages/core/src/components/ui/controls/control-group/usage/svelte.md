```html {6-8,10-13,26} title="example.svelte"
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Controls fullWidth>
      <ControlGroup>
        <ScrubberControl />
      </ControlGroup>

      <ControlGroup space="top">
        <PlaybackControl />
        <VolumeControl />
      </ControlGroup>
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
    ScrubberControl,
    ControlGroup,
  } from '@vime/svelte';
</script>
```
