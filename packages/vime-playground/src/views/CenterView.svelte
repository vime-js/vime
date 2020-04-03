<Center>
  <svelte:component 
    this={Component} 
    {...$$restProps}
    bind:this={component}
  />
</Center>

<script>
  import { createEventDispatcher } from 'svelte';
  import { Center } from '../components';

  const dispatch = createEventDispatcher();

  let component;
  let prevComponent;

  export let Component;

  export const getComponent = () => component;

  $: if (component) dispatch('mount', component);
  
  $: if (prevComponent !== component) {
    if (prevComponent && !component) dispatch('destroy');
    prevComponent = component;
  }
</script>