<InteractiveCanvas
  props={Object.values(props)}
  events={firedEvents}
  on:propschange={onPropsChange}
>
  <svelte:component
    {...$$restProps}
    this={Component}
    bind:this={component}
  />
</InteractiveCanvas>

<script>
  import { onDestroy } from 'svelte';
  import { run_all, safe_not_equal } from 'svelte/internal';
  import InteractiveCanvas from './InteractiveCanvas.svelte';
  
  import { 
    debounce, is_number, is_function, 
    is_boolean, is_string, is_object,
    is_array, is_svelte_instance, is_element
  } from '@vime/utils';

  let component;
  let props = [];
  let dispose = [];
  let firedEvents = [];
  let eventsQueue = [];
  
  const bannedEvents = ['currentTime', 'internalTime', 'progress'];

  export let Component;
  export let events = [];

  const isGetterMethod = methodName => {
    const validPrefixes = ['get', 'is', 'has', 'can', 'should', 'use'];
    return validPrefixes.some(prefix => methodName.startsWith(prefix));
  };

  const inferPropType = value => {
    if (is_boolean(value)) {
      return 'boolean';
    } else if (is_number(value)) {
      return 'number';
    } else if (!is_function(value) && (is_object(value) || is_array(value))) {
      return 'editor';
    } else {
      return 'text';
    }
  };

  const extractValue = value => {
    if (is_function(value)) {
      return value();
    } else if (is_svelte_instance(value)) {
      return `${value.constructor.name} Component`;
    } else if (is_element(value)) {
      return 'HTML DOM Element';
    } else {
      return value;
    }
  };

  const sortProps = unsortedProps => {
    const result = {};
    const newOrder = [
      ...Object.keys(unsortedProps).filter(p => !unsortedProps[p].readonly),
      ...Object.keys(unsortedProps).filter(p => unsortedProps[p].readonly)
    ];
    newOrder.forEach(p => { result[p] = unsortedProps[p]; });
    props = result;
  };

  const onPropUpdate = (prop, value, isReadonly) => {
    if (!props[prop]) {
      props[prop] = {
        id: prop,
        type: inferPropType(value),
        value: extractValue(value),
        readonly: isReadonly || is_function(value),
        method: is_function(value) && isGetterMethod(prop)
      };
      sortProps(props);
    } else if (safe_not_equal(props[prop].value, value)) {
      props[prop].value = extractValue(value);
    }
  };

  const onPropsChange = e => {
    if (!e) return;
    const { prop, value } = e.detail;
    component[prop] = value;
  };

  const onUpdate = () => {
    Object.keys(component.$$.props).forEach(prop => {
      const index = component.$$.props[prop];
      const value = component.$$.ctx[index];
      if (is_function(value) && !isGetterMethod(prop)) return;
      onPropUpdate(prop, value);
    });
  };

  const flushEventsQueue = debounce(() => {
    eventsQueue.forEach(({ event, data }) => {
      firedEvents.unshift({
        event,
        time: Date.now(),
        data: extractValue(data)
      });
    });
    eventsQueue = [];
    firedEvents = firedEvents;
  }, 0);

  const onFiredEvent = (event, data) => {
    if (bannedEvents.includes(event)) return;
    eventsQueue.push({ event, data });
    flushEventsQueue();
  };

  const listenToStore = () => {
    const store = component.getStore();
    Object.keys(store).forEach(prop => {
      if (prop.startsWith('_')) return;
      dispose.push(store[prop].subscribe(v => {
        onPropUpdate(prop, v, !store[prop].set);
        onFiredEvent(prop, v);
      }));
    });
  };

  const listenToEvents = () => {
    events.forEach(event => {
      dispose.push(component.$on(event, e => { 
        onFiredEvent(event, e.detail);
      }));
    });
  };

  const onMount = async () => {
    props = [];
    firedEvents = [];
    eventsQueue = [];
    run_all(dispose);
    dispose = [];
    if (!component) return;
    if (is_function(component.getStore)) {
      listenToStore();
    } else {
      component.$$.after_update.push(onUpdate);
    }
    listenToEvents();
  };

  onDestroy(() => {
    run_all(dispose);
    dispose = [];
    eventsQueue = [];
  });

  $: onMount(component);
</script>