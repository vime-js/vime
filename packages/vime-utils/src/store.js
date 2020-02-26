import { onDestroy } from 'svelte';
import { get, writable, derived } from 'svelte/store';
import { noop, get_current_component, not_equal, init, validate_store } from 'svelte/internal';
import { create_prop, merge_deep } from './object';
import { is_function } from './unit';
import { try_on_svelte_destroy, try_create_svelte_dispatcher } from './svelte';

export const safe_unsubscribe = unsubscribe => {
  let once = false;
  return () => {
    if (once) return;
    unsubscribe();
    once = true;
  };
};

export const is_store = store => store && is_function(store.subscribe);

export const safe_get = v => is_store(v) ? get(v) : v;

export const subscribe = (store, cb) => {
  validate_store(store);
  const unsubscribe = safe_unsubscribe(store.subscribe(cb));
  try_on_svelte_destroy(unsubscribe);
  return unsubscribe;
};

export const subscribe_and_dispatch = (store, event) => {
  const dispatch = try_create_svelte_dispatcher();
  return subscribe(store, $v => dispatch(event, $v));
};

export const subscribe_and_dispatch_if_true = (store, event) => {
  const dispatch = try_create_svelte_dispatcher();
  return subscribe(store, $v => $v && dispatch(event, $v));
};

export const subscribe_until_true = (store, cb) => {
  validate_store(store);
  if (get(store)) {
    cb();
    return noop;
  }
  const unsubscribe = subscribe(store, $v => {
    $v && cb();
    $v && unsubscribe();
  });
  return unsubscribe;
};

// Private is "private" to the component who instantiates it, when it is exposed publically
// the set method should be removed. The utility `make_private_stores_readonly` does exactly
// this. This is also what `map_store_to_component` uses.
export const make_store_private = store => ({
  ...store,
  private: true
});

export const private_writable = initialValue => make_store_private(writable(initialValue));

export const mergeable = initialValue => {
  const store = writable(initialValue);
  return {
    ...store,
    set: v => store.update(p => merge_deep(p, v))
  };
};

export const fallbackable = (initialValue, fallback) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: v => v ? store.set(v) : store.set(get(fallback) || null)
  };
};

export const private_fallbackable = (initialValue, fallback) => {
  return make_store_private(fallbackable(initialValue, fallback));
};

export const writable_if = (initialValue, condition) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: v => safe_get(condition) && store.set(v),
    forceSet: store.set
  };
};

export const indexable = (initialValue, bounds) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: index => {
      const _bounds = safe_get(bounds);
      if (!_bounds) {
        store.set(-1);
        return;
      }
      if (index >= 0 && index < _bounds.length) store.set(index);
    }
  };
};

export const selectable = (initialValue, possibleValues) => {
  const store = writable(initialValue);
  return {
    ...store,
    set: selection => {
      const values = safe_get(possibleValues);
      if (!values) {
        store.set(null);
        return;
      }
      if (values.includes(selection)) store.set(selection);
    },
    forceSet: store.set
  };
};

export const selectable_if = (initialValue, possibleValues, condition) => {
  const store = selectable(initialValue, possibleValues);
  return {
    ...store,
    set: selection => safe_get(condition) && store.set(selection),
    forceSet: store.forceSet
  };
};

export const make_store_readonly = store => ({ subscribe: store.subscribe });

export const make_private_stores_readonly = stores => {
  const result = {};
  Object.keys(stores).forEach(name => {
    const store = stores[name];
    result[name] = store.private ? make_store_readonly(store) : store;
  });
  return result;
};

export const map_store_to_component = stores => {
  let ctx = {};
  let canWrite = {};
  const component = get_current_component();

  create_prop(component, 'getStore', {
    get: () => () => make_private_stores_readonly(stores)
  });

  onDestroy(() => {
    ctx = {};
    canWrite = {};
  });

  const onUpdateProp = (prop, newValue) => {
    if (!canWrite[prop] || !not_equal(ctx[prop], newValue)) return;
    ctx[prop] = newValue;
    stores[prop].set(newValue);
  };

  Object.keys(stores).forEach(prop => {
    const store = stores[prop];
    ctx[prop] = get(store);
    canWrite[prop] = !!store.set && !store.private;
    create_prop(component, prop, {
      get: () => get(store),
      set: canWrite[prop] ? v => onUpdateProp(prop, v) : undefined
    });
  });

  // onPropsChange
  return props => Object.keys(props).forEach(prop => onUpdateProp(prop, props[prop]));
};
