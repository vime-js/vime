```html {6-8,10-13,24,35} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls>
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
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    ControlGroup,
    ScrubberControl,
    PlaybackControl,
    VolumeControl,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      ControlGroup,
      ScrubberControl,
      PlaybackControl,
      VolumeControl,
    },
  };
</script>
```
