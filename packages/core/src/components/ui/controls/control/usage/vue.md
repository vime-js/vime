```html {6-14,25,35} title="example.vue"
<template>
  <VimePlayer :paused="paused" @vPausedChange="onPausedChange">
    <!-- ... -->
    <VimeUi>
      <VimeControls fullWidth>
        <VimeControl
          label="Playback"
          keys="k"
          :pressed="paused"
          @click="onClick"
        >
          <VimeIcon :href="icon" />
          <VimeTooltip>{{tooltip}} (k)</VimeTooltip>
        </VimeControl>
      </VimeControls>
    </VimeUi>
  </VimePlayer>
</template>

<script>
  import {
    VimePlayer,
    VimeUi,
    VimeControls,
    VimeControl,
    VimeIcon,
    VimeTooltip,
  } from "@vime/vue";

  export default {
    components: {
      VimePlayer,
      VimeUi,
      VimeControls,
      VimeControl,
      VimeIcon,
      VimeTooltip,
    },

    data: {
      paused: true,
    },

    computed: {
      icon() {
        return this.paused ? '#vime-play' : '#vime-pause';
      },
      tooltip() {
        return this.paused ? 'Play' : 'Pause';
      },
    },

    methods: {
      onClick() {
        this.paused = !paused;
      },

      onPausedChange(paused: boolean) {
        this.paused = paused;
      }
    },
  };,
</script>
```
