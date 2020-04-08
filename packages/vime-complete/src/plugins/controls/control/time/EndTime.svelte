<Time 
  seconds={$duration}
  aria-label={$i18n.duration}
/>

<script context="module">
  export const ID = 'vEndTime';
  export const LABEL = 'displayEndTime';
</script>

<script>
  import Time from './Time.svelte';

  export let player;

  const { duration, i18n } = player.getStore();
</script>