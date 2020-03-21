<InteractiveCanvas
  props={Object.values(props)}
  events={firedEvents}
  on:propschange={onPropsChange}
>
  <svelte:component
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
    is_boolean, is_object, is_array,
    is_svelte_instance, is_element, is_svelte_component,
  } from '@vime-js/utils';

  let component;
  let props = [];
  let dispose = [];
  let firedEvents = [];
  let eventsQueue = [];
  
  const bannedEvents = ['currentTime', 'internalTime', 'progress'];

  export let Component;
  export let events = [];

  const isGetterMethod = (methodName, value) => {
    const validPrefixes = ['get', 'is', 'has', 'can', 'should', 'use'];
    return is_function(value) && validPrefixes.some((prefix) => methodName.startsWith(prefix));
  };

  const isSetterMethod = (methodName, value) => is_function(value)
    && !isGetterMethod(methodName, value);

  const inferPropType = (value) => {
    if (is_boolean(value)) { return 'boolean'; }
    if (is_number(value)) { return 'number'; }
    if (!is_function(value) && (is_object(value) || is_array(value))) { return 'editor'; }
    return 'text';
  };

  const extractValue = (value) => {
    if (is_svelte_component(value)) { return `${value.name} Component`; }
    if (is_svelte_instance(value)) { return `${value.constructor.name} Instance`; }
    if (is_element(value)) { return value.outerHTML; }
    if (is_function(value)) { return 'Function'; }
    return value;
  };

  const sortProps = (unsortedProps) => {
    const result = {};
    const newOrder = [
      ...Object.keys(unsortedProps).filter((p) => !unsortedProps[p].readonly),
      ...Object.keys(unsortedProps).filter((p) => unsortedProps[p].readonly),
    ];
    newOrder.forEach((p) => { result[p] = unsortedProps[p]; });
    props = result;
  };

  const isReadonly = (value) => is_function(value) || is_svelte_instance(value) || is_element(value);

  const onPropUpdate = (prop, value, readonly) => {
    if (isSetterMethod(prop, value)) return;
    const isMethod = isGetterMethod(prop, value);
    const extractedValue = extractValue(isMethod ? value() : value);
    if (!props[prop]) {
      props[prop] = {
        id: prop,
        type: inferPropType(extractedValue),
        value: extractedValue,
        method: isMethod,
        readonly: readonly || isMethod || isReadonly(value),
      };
      sortProps(props);
    }
    if (safe_not_equal(props[prop].value, extractedValue)) {
      props[prop].value = extractedValue;
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

  const flushEventsQueue = debounce(() => {
    eventsQueue.forEach(({ event, data }) => {
      firedEvents.unshift({
        event,
        time: Date.now(),
        data: extractValue(data),
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
    Object.keys(store).forEach((prop) => {
      if (prop.startsWith('_')) return;
      dispose.push(store[prop].subscribe((v) => {
        onPropUpdate(prop, v, !store[prop].set);
        onFiredEvent(prop, v);
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
    props = [];
    firedEvents = [];
    eventsQueue = [];
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
    if (is_function(component.getStore)) listenToStore();
    component.$$.after_update.push(onComponentUpdate);
    listenToEvents();
    hasComponentMounted = true;
  };

  onDestroy(onComponentDestroy);

  $: onComponentMount(component);
</script>