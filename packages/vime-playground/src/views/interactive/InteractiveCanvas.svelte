<div class="canvas">
  <div class="view">
    <Center small={smallView}>
      <slot />
    </Center>
  </div>
  <Interactives 
    {props}
    {events}
    {storeChanges}
    on:propschange
  />
</div>

<script>
  import { Center } from '../../components';
  import Interactives from './Interactives.svelte';

  export let props = [];
  export let events = [];
  export let storeChanges = [];
  export let smallView = false;
</script>

<style>
  .canvas {
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .view {
    flex: 1;
    padding: 24px;
    position: relative;
  }
</style>