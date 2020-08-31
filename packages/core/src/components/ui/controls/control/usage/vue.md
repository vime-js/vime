```html {2-10,17,29} title="playback-control.vue"
<template>
  <VimeControl
    keys="k"
    :label="i18n.playback"
    :pressed="paused"
    @click="onClick"
  >
    <VimeIcon :href="icon" />
    <VimeTooltip>{{tooltip}} (k)</VimeTooltip>
  </VimeControl>
</template>

<script>
  import {
    VimeMixin,
    VimeControl,
    VimeIcon,
    VimeTooltip,
  } from "@vime/vue";

  export default {
    mixins: [VimeMixin(['paused', 'i18n'])]

    components: {
      VimeControl,
      VimeIcon,
      VimeTooltip,
    },

    data: {
      paused: true,
      i18n: {},
    },

    computed: {
      icon() {
        return this.paused ? '#vime-play' : '#vime-pause';
      },
      tooltip() {
        return this.paused ? this.i18n.play : this.i18n.pause;
      },
    },

    methods: {
      onClick() {
        this.paused = !paused;
      },
    },
  };,
</script>
```
