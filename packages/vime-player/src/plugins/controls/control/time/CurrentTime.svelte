<Time 
  time={$currentTime}
  aria-label={$i18n.currentTime}
/>

<script context="module">
  export const ID = 'vCurrentTime';
  export const LABEL = 'displayCurrentTime';
</script>

<script>
  import Time from './Time.svelte';

  export let player;

  const { currentTime, i18n } = player.getStore();
</script>