import { get, writable, derived } from 'svelte/store';
import { create_prop, merge_obj_deep } from './object';
import { is_function } from './unit';
import { try_on_svelte_destroy, try_create_svelte_dispatcher } from './svelte';

import {
  noop, not_equal, validate_store,
  get_current_component,
} from 'svelte/internal';

export const safe_unsubscribe = (unsubscribe) => {
  let once = false;
  return () => {
    if (once) return;
    unsubscribe();
    once = true;
  };
};

export const is_store = (store) => store && is_function(store.subscribe);

export const safe_get = (v) => (is_store(v) ? get(v) : v);

export const subscribe = (store, cb) => {
  validate_store(store);
  const unsubscribe = safe_unsubscribe(store.subscribe(cb));
  try_on_svelte_destroy(unsubscribe);
  return unsubscribe;
};

export const subscribe_and_dispatch = (store, event) => {
  const dispatch = try_create_svelte_dispatcher();
  return subscribe(store, ($v) => { dispatch(event, $v); });
};

export const subscribe_and_dispatch_if_true = (store, event) => {
  const dispatch = try_create_svelte_dispatcher();
  return subscribe(store, ($v) => { if ($v) dispatch(event, $v); });
};

export const subscribe_until_true = (store, cb) => {
  validate_store(store);
  if (get(store)) {
    cb();
    return noop;
  }
  const unsubscribe = subscribe(store, ($v) => {
    if (!$v) return;
    cb();
    unsubscribe();
  });
  return unsubscribe;
};

// Private is "private" to the component who instantiates it, when it is exposed publically
// the set method should be removed. The utility `make_private_stores_readonly` does exactly
// this. This is also what `map_store_to_component` below uses.
const make_store_private = (store) => ({
  ...store,
  private: true,
});

const add_condition_to_store = (store, condition) => ({
  ...store,
  set: (value) => { if (safe_get(condition)) store.set(value); },
  forceSet: store.set,
});

export const private_writable = (initialValue) => make_store_private(writable(initialValue));

export const mergeable = (initialValue) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: (v) => { store.update((p) => merge_obj_deep(p, v)); },
  };
};

export const writable_with_fallback = (initialValue, fallback) => {
  const store = writable(initialValue);
  return {
    ...store,
    subscribe: derived([store, fallback], ([$s, $f]) => $s || $f).subscribe,
  };
};

export const private_writable_with_fallback = (
  initialValue,
  fallback,
) => make_store_private(writable_with_fallback(initialValue, fallback));

export const writable_if = (
  initialValue,
  condition,
) => add_condition_to_store(writable(initialValue), condition);

export const private_writable_if = (
  initialValue,
  condition,
) => make_store_private(writable_if(initialValue, condition));

export const indexable = (bounds) => {
  const store = writable(-1);
  return {
    ...store,
    subscribe: derived([store, bounds], ([$value, $bounds]) => {
      if (!$bounds || $bounds.length === 0) return -1;
      if ($value >= 0 && $value < $bounds.length) return $value;
      return -1;
    }).subscribe,
  };
};

export const indexable_if = (
  bounds,
  condition,
) => add_condition_to_store(indexable(bounds), condition);

export const rangeable = (initialValue, lowerBound, upperBound) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: (value) => {
      store.set(Math.max(safe_get(lowerBound), Math.min(value, safe_get(upperBound))));
    },
  };
};

export const rangeable_if = (
  initialValue,
  lowerBound,
  upperBound,
  condition,
) => add_condition_to_store(rangeable(initialValue, lowerBound, upperBound), condition);

export const selectable = (initialValue, values) => {
  let newValue;
  const store = writable(initialValue);
  return {
    ...store,
    subscribe: derived([store, values], ([$value, $values]) => {
      if (!$values) { newValue = null; }
      if ($values.includes($value)) { newValue = $value; }
      return newValue;
    }).subscribe,
  };
};

export const selectable_if = (
  initialValue,
  values,
  condition,
) => add_condition_to_store(selectable(initialValue, values), condition);

export const make_store_readonly = (store) => ({ subscribe: store.subscribe });

export const make_private_stores_readonly = (stores) => {
  const result = {};
  Object.keys(stores).forEach((name) => {
    const store = stores[name];
    result[name] = store.private ? make_store_readonly(store) : store;
  });
  return result;
};

export const map_store_to_component = (comp, stores) => {
  let canWrite = {};
  const component = comp || get_current_component();

  create_prop(component, 'getStore', {
    get: () => () => make_private_stores_readonly(stores),
    configurable: true,
  });

  component.$$.on_destroy.push(() => {
    Object.keys(stores).forEach((prop) => { delete component[prop]; });
    delete component.getStore;
    canWrite = {};
  });

  const onUpdateProp = (prop, newValue) => {
    if (!canWrite[prop] || !not_equal(get(stores[prop]), newValue)) return;
    stores[prop].set(newValue);
  };

  Object.keys(stores).forEach((prop) => {
    const store = stores[prop];
    canWrite[prop] = !!store.set && !store.private;
    create_prop(component, prop, {
      get: () => get(store),
      set: canWrite[prop] ? ((v) => { onUpdateProp(prop, v); }) : undefined,
      configurable: true,
    });
  });

  // onPropsChange
  return (props) => Object.keys(props).forEach((prop) => { onUpdateProp(prop, props[prop]); });
};
