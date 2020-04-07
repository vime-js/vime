<InteractiveCanvas
  props={Object.values(props)}
  events={firedEvents}
  {storeChanges}
  on:propschange={onPropsChange}
>
  <svelte:component
    this={Component}
    bind:this={component}
  />
</InteractiveCanvas>

<script>
  import { onDestroy } from 'svelte';
  import { tick, run_all, safe_not_equal } from 'svelte/internal';
  import InteractiveCanvas from './InteractiveCanvas.svelte';
  import { is_function } from '@vime-js/utils';

  import {
    is_getter_method, is_setter_method, is_readonly_prop,
    infer_prop_type, format_prop_value,
  } from './interactiveUtils';

  let component;
  let props = [];
  let dispose = [];
  let firedEvents = [];
  let storeChanges = [];
  
  const bannedEvents = ['currentTime', 'internalTime', 'progress'];

  export let Component;
  export let events = [];

  const sortProps = (unsortedProps) => {
    const result = {};
    const newOrder = [
      ...Object.keys(unsortedProps).filter((p) => !unsortedProps[p].readonly),
      ...Object.keys(unsortedProps).filter((p) => unsortedProps[p].readonly),
    ];
    newOrder.forEach((p) => { result[p] = unsortedProps[p]; });
    props = result;
  };

  const onPropUpdate = (prop, value, readonly) => {
    if (is_setter_method(prop, value)) return;
    const isMethod = is_getter_method(prop, value);
    const formattedValue = format_prop_value(isMethod ? value() : value);
    if (!props[prop]) {
      props[prop] = {
        id: prop,
        type: infer_prop_type(formattedValue),
        value: formattedValue,
        method: isMethod,
        readonly: readonly || isMethod || is_readonly_prop(value),
      };
      sortProps(props);
    }
    if (safe_not_equal(props[prop].value, formattedValue)) {
      props[prop].value = formattedValue;
    }
  };

  const onPropsChange = (e) => {
    if (!e) return;
    const { prop, value } = e.detail;
    component[prop] = value;
  };

  const onComponentUpdate = () => {
    Object.keys(component.$$.props).forEach((prop) => {
      const index = component.$$.props[prop];
      const value = component.$$.ctx[index];
      onPropUpdate(prop, value);
    });
  };

  const onFiredEvent = (event, data) => {
    if (bannedEvents.includes(event)) return;
    firedEvents.unshift({
      event,
      time: Date.now(),
      data: format_prop_value(data),
    });
    firedEvents = firedEvents;
  };

  const onStoreChange = (id, data) => {
    if (bannedEvents.includes(id)) return;
    storeChanges.unshift({
      event: id,
      time: Date.now(),
      data: format_prop_value(data),
    });
    storeChanges = storeChanges;
  };

  const listenToStore = () => {
    const store = component.getStore();
    Object.keys(store).forEach((id) => {
      if (id.startsWith('_')) return;
      dispose.push(store[id].subscribe((v) => {
        onPropUpdate(id, v, !store[id].set);
        onStoreChange(id, v);
      }));
    });
  };

  const listenToEvents = () => {
    events.forEach((event) => {
      dispose.push(component.$on(event, (e) => {
        onFiredEvent(event, e.detail);
      }));
    });
  };

  const onComponentDestroy = () => {
    run_all(dispose);
    dispose = [];
  };

  let hasComponentMounted = false;
  const onComponentMount = async () => {
    if (hasComponentMounted) return;
    onComponentDestroy();
    if (!component) return;
    Object.keys($$restProps).forEach((prop) => {
      component[prop] = $$restProps[prop];
    });
    listenToEvents();
    if (is_function(component.getStore)) listenToStore();
    await tick();
    component.$$.after_update.push(onComponentUpdate);
    hasComponentMounted = true;
  };

  onDestroy(onComponentDestroy);

  $: onComponentMount(component);
</script>