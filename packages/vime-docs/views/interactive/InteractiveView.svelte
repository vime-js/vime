<InteractiveCanvas
  props={Object.values(props)}
  events={firedEvents}
  on:change={onChange}
>
  <svelte:component
    {...$$restProps}
    {...cProps}
    this={Component}
    bind:this={component}
  />
</InteractiveCanvas>

<script>
  import { onDestroy } from 'svelte';
  import { run_all, safe_not_equal } from 'svelte/internal';
  import InteractiveCanvas from './InteractiveCanvas.svelte';
  import { is_function } from '@vime/utils';

  let component;
  let props = [];
  let cProps = {};
  let dispose = [];
  let firedEvents = {};

  export let Component;
  export let events = [];
  export let propTypes = {};

  const onUpdate = () => {
    Object.keys(component.$$.props).forEach(prop => {
      const index = component.$$.props[prop];
      const value = component.$$.ctx[index];
      if (!props[prop]) {
        props[prop] = {
          id: prop,
          type: propTypes[prop],
          value: is_function(value) ? value() : value,
          readonly: is_function(value)
        };
      } else if (safe_not_equal(props[prop].value, value)) {
        props[prop].value = is_function(value) ? value() : value;
      }
    });
    onChange();
  };
  
  const onChange = () => {
    setTimeout(() => {
      cProps = Object.keys(props).reduce((o, p) => ({ ...o, [p]: props[p].value }), {});
    }, 50);
  };

  const listenToEvents = () => {
    events.forEach(event => {
      dispose.push(component.$on(event, e => { 
        firedEvents[event] = {
          time: Date.now(),
          detail: e.detail 
        };
      }));
    });
  };

  const onMount = async () => {
    props = [];
    cProps = {};
    firedEvents = {};
    run_all(dispose);
    dispose = [];
    if (!component) return;
    component.$$.after_update.push(onUpdate);
    onChange();
    listenToEvents();
  };

  onDestroy(() => {
    run_all(dispose);
    dispose = [];
  });

  $: onMount(component);
</script>