```html {2-10,19,27} title="playback-control.vue"
<template>
  <div ref="domRef">
    <VimeControl
      keys="k"
      :label="i18n.playback"
      :pressed="paused"
      @click="onClick"
    >
      <VimeIcon :href="icon" />
      <VimeTooltip>{{tooltip}} (k)</VimeTooltip>
    </VimeControl>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import {
  usePlayerContext,
  VimeControl,
  VimeIcon,
  VimeTooltip,
} from '@vime/vue-next';

export default defineComponent({
  name: 'PlaybackControl',
  components: {
    VimeControl,
    VimeIcon,
    VimeTooltip,
  },
  setup() {
    const domRef = ref(null);

    const paused = usePlayerContext(domRef, 'paused', true);
    const i18n = usePlayerContext(domRef, 'i18n', {});

    const icon = computed(() => paused.value ? '#vime-play' : '#vime-pause');
    const tooltip = computed(() => paused.value ? i18n.value.play : i18n.value.pause);

    return { domRef, paused, i18n, icon, tooltip };
  },
  methods: {
    onClick() {
      this.paused = !this.paused;
    },
  },
});
</script>
```
