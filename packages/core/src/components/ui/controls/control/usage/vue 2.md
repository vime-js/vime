```html {2-10,16,24} title="playback-control.vue"
<template>
  <Control keys="k" :label="i18n.playback" :pressed="paused" @click="onClick">
    <Icon :name="icon" />
    <Tooltip>{{tooltip}} (k)</Tooltip>
  </Control>
</template>

<script>
  import {
    Mixin,
    Control,
    Icon,
    Tooltip,
  } from '@vime/vue';

  export default {
    mixins: [Mixin(['paused', 'i18n'])]
    components: {
      Control,
      Icon,
      Tooltip,
    },
    data: {
      paused: true,
      i18n: {},
    },
    computed: {
      icon() {
        return this.paused ? 'play' : 'pause';
      },
      tooltip() {
        return this.paused ? this.i18n.play : this.i18n.pause;
      },
    },
    methods: {
      onClick() {
        this.paused = !this.paused;
      },
    },
  };,
</script>
```
