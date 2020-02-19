import { onDestroy } from 'svelte'
import { get, writable } from 'svelte/store'
import { noop, get_current_component, not_equal } from 'svelte/internal'
import { create_prop, merge_deep } from './object'
import { try_on_svelte_destroy, try_create_svelte_dispatcher } from './svelte'

export const safe_unsubscribe = unsubscribe => {
  let once = false
  return () => {
    if (once) return
    unsubscribe()
    once = true
  }
}

export const subscribe = (store, cb) => {
  const unsubscribe = safe_unsubscribe(store.subscribe(cb))
  try_on_svelte_destroy(unsubscribe)
  return unsubscribe
}

export const subscribe_and_dispatch = (store, event) => {
  const dispatch = try_create_svelte_dispatcher()
  return subscribe(store, $v => dispatch(event, $v))
}

export const subscribe_and_dispatch_if_true = (store, event) => {
  const dispatch = try_create_svelte_dispatcher()
  return subscribe(store, $v => $v && dispatch(event, $v))
}

export const subscribe_until_true = (store, cb) => {
  if (get(store)) {
    cb()
    return noop
  }
  const unsubscribe = subscribe(store, $v => {
    $v && cb()
    $v && unsubscribe()
  })
  return unsubscribe
}

export const private_writable = initialValue => ({
  ...writable(initialValue),
  private: true
})

export const extendable = initialValue => {
  const store = writable(initialValue)
  return {
    ...store,
    set: v => { store.update(p => merge_deep(p, v)) }
  }
}

export const selectable = (initialValue, possibleValues) => {
  const store = writable(initialValue)
  return {
    ...store,
    set: v => {
      const values = get(possibleValues)
      if (v && !values.includes(v)) return
      store.set(v)
    }
  }
}

export const make_store_readonly = store => ({ subscribe: store.subscribe })

export const make_private_stores_readonly = stores => {
  const result = {}
  Object.keys(stores).forEach(name => {
    const store = stores[name]
    result[name] = store.private ? make_store_readonly(store) : store
  })
  return result
}

export const map_store_to_component = stores => {
  let ctx = {}
  let canWrite = {}
  const component = get_current_component()

  create_prop(component, 'getStore', {
    get: () => () => make_private_stores_readonly(stores)
  })

  onDestroy(() => {
    ctx = {}
    canWrite = {}
  })

  const onUpdateProp = (prop, newValue) => {
    if (!canWrite[prop] || !not_equal(ctx[prop], newValue)) return
    ctx[prop] = newValue
    stores[prop].set(newValue)
  }

  Object.keys(stores).forEach(prop => {
    const store = stores[prop]
    ctx[prop] = get(store)
    canWrite[prop] = !!store.set && !store.private
    create_prop(component, prop, {
      get: () => get(store),
      set: canWrite[prop] ? v => onUpdateProp(prop, v) : undefined
    })
  })

  // onPropsChange
  return props => Object.keys(props).forEach(prop => onUpdateProp(prop, props[prop]))
}
