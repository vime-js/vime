<Time 
  time={$duration}
  aria-label={$i18n.duration}
/>

<script context="module">
  export const ID = 'vDurationTime';
  export const LABEL = 'displayDuration';
</script>

<script>
  import { formatTime } from '@vime/core';
  import Time from './Time.svelte';

  export let player;

  const { duration, i18n } = player.getStore();
</script>