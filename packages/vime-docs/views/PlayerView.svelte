<CenterView
  {Component}
  {...$$restProps}
  bind:this={centerView}
/>

<script>
  import { onDestroy, createEventDispatcher } from 'svelte';
  import { run_all } from 'svelte/internal';
  import CenterView from './CenterView.svelte';

  const dispatch = createEventDispatcher();

  let player;
  let centerView;
  let dispose = [];

  export let Component;

  const listenToStore = () => {
    const store = player.getStore();
    Object.keys(store).forEach(prop => {
      dispose.push(
        store[prop].subscribe(v => dispatch(prop, v))
      );
    });
  };

  onDestroy(() => {
    run_all(dispose);
    dispose = [];
  });

  $: if (centerView) {
    player = centerView.getComponent();
  } else {
    player = null;
  }

  $: if (player) {
    listenToStore();
  } else {
    run_all(dispose);
    dispose = [];
  }
</script>