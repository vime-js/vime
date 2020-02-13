import { onDestroy } from 'svelte'
import { get } from 'svelte/store'
import { run_all, get_current_component, not_equal } from 'svelte/internal'
import { merge_deep } from './object'

export const make_readonly = writable => ({ subscribe: writable.subscribe })

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

export const map_store_to_component = stores => {
  let dispose = []
  let ctx = {}
  let canWrite = {}
  const component = get_current_component()

  onDestroy(() => {
    run_all(dispose)
    ctx = null
    canWrite = null
  })

  const onUpdateProp = (prop, newValue) => {
    if (!canWrite[prop] || !not_equal(ctx[prop], newValue)) return
    ctx[prop] = newValue
    stores[prop].set(newValue)
  }

  Object.keys(stores).forEach(prop => {
    const store = stores[prop]
    ctx[prop] = get(store)
    canWrite[prop] = !!store.set
    Object.defineProperty(component, prop, {
      get: () => get(store),
      set: canWrite[prop] ? v => onUpdateProp(prop, v) : undefined
    })
  })

  // onPropsChange
  return props => Object.keys(props).forEach(prop => onUpdateProp(prop, props[prop]))
}

export const map_component_to_store = () => {
  let ctx = {}
  let stores = {}
  let map = {}
  let dispose = []
  const storeNames = {}
  let component = get_current_component()

  const isWritable = prop => !is_function(component[prop])
  const getValue = prop => isWritable(prop) ? component[prop] : component[prop]()

  onDestroy(() => {
    run_all(dispose)
    component = null
    stores = null
    ctx = null
    map = null
  })

  onMount(() => {
    const isReadable = prop => ['get', 'is', 'has', 'can'].some(s => prop.startsWith(s))

    const formatReadableName = prop => {
      if (!prop.startsWith('get')) return prop
      const name = prop.replace('get', '')
      return name.charAt(0).toLowerCase() + name.slice(1)
    }

    Object.keys(component.$$.props).forEach(prop => {
      if (!isWritable(prop) && !isReadable(prop)) return
      const storeName = isWritable(prop) ? prop : formatReadableName(prop)
      const value = getValue(prop)
      ctx[prop] = value
      storeNames[prop] = storeName
      const store = writable(value)
      stores[storeName] = store
      map[storeName] = isWritable(prop)
        ? store
        : { subscribe: store.subscribe }
      if (isWritable(prop)) dispose.push(store.subscribe(v => { component.$set({ [prop]: v }) }))
    })
  })

  afterUpdate(() => {
    Object.keys(component.$$.props).forEach(prop => {
      const store = stores[storeNames[prop]]
      if (!store) return
      const newValue = getValue(prop)
      if (not_equal(ctx[prop], newValue)) {
        store.set(newValue)
        ctx[prop] = newValue
      }
    })
  })

  return map
}