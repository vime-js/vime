```html {2-10,19,27} title="playback-control.vue"
<template>
  <div ref="domRef">
    <Control
      keys="k"
      :label="i18n.playback"
      :pressed="paused"
      @click="onClick"
    >
      <Icon :name="icon" />
      <Tooltip>{{tooltip}} (k)</Tooltip>
    </Control>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import {
  usePlayerContext,
  Control,
  Icon,
  Tooltip,
} from '@vime/vue-next';

export default defineComponent({
  name: 'PlaybackControl',
  components: {
    Control,
    Icon,
    Tooltip,
  },
  setup() {
    const domRef = ref(null);

    const paused = usePlayerContext(domRef, 'paused', true);
    const i18n = usePlayerContext(domRef, 'i18n', {});

    const icon = computed(() => paused.value ? 'play' : 'pause');
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
