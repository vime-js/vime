```html {8,22,33} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <Controls>
        <PlaybackControl />
        <VolumeControl />
        <ControlSpacer />
        <FullscreenControl />
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    PlaybackControl,
    VolumeControl,
    ControlSpacer,
    FullscreenControl,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      PlaybackControl,
      VolumeControl,
      ControlSpacer,
      FullscreenControl,
    },
  };
</script>
```
