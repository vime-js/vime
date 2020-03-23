<div>
  <CurrentTime {player} />
  <TimeDivider />
  <EndTime {player} />
</div>

<script context="module">
  export const ID = 'vTimeProgress';
  export const LABEL = 'displayTimeProgress';
</script>

<script>
  import CurrentTime from './CurrentTime.svelte';
  import TimeDivider from './TimeDivider.svelte';
  import EndTime from './EndTime.svelte';

  export let player;
</script>

<style>
  div {
    display: flex;
    align-items: center;
  }
</style>