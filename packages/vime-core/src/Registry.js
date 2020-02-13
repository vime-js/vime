import { get_current_component } from 'svelte/internal'
import { tick, createEventDispatcher, onDestroy } from 'svelte'
import { writable, derived, get } from 'svelte/store'
import { is_instance_of } from '~utils/unit'

export default class Registry {
  constructor (name) {
    this._name = name + 'Registry'
    this._registry = new Set()
    this._values = writable({})
    this._dispatch = null
    this._parent = null
    if (get_current_component()) {
      onDestroy(() => this.destroy())
      this._dispatch = createEventDispatcher()
    }
  }

  name () { return this._name }

  registrations () { return Array.from(this._registry.values()) }

  value (id) { return get(this._values)[id] }

  values () { return get(this._values) }

  has (id) { return this._registry.has(id) }

  register (id, value) {
    if (!id) this._error('registration failed because `id` is missing')
    if (this.has(id)) this._error(`attempted to register with \`id\` [${id}] but it is taken`)
    this._registry.add(id)
    this._values.update($values => ({ ...$values, [id]: value }))
    if (value && value.$$ && value.$$.on_destroy) {
      value.$$.on_destroy.push(() => { this.deregister(id) })
    }
    if (is_instance_of(value, Registry)) value._parent = this
    this._dispatch && this._dispatch('register', { id, value })
    this.invalidateParent()
  }

  invalidateParent () {
    if (this._parent) {
      this._parent._values.update(v => v)
      this._parent.invalidateParent()
    }
  }

  update (id, value) {
    if (!this.has(id)) {
      this._error(`attempted to update an unregistered value with \`id\` [${id}]`)
    }
    this._values.update($values => ({ ...$values, [id]: value }))
    this.invalidateParent()
  }

  deregister (id) {
    this._registry.delete(id)
    this._values.update($values => {
      delete $values[id]
      return $values
    })
    this._dispatch && this._dispatch('deregister', id)
    this.invalidateParent()
  }

  unwrap (values) {
    const result = {}
    Object.keys(values).forEach(id => {
      const value = values[id]
      result[id] = is_instance_of(value, Registry) ? this.unwrap(value.values()) : value
    })
    return result
  }

  subscribe () {
    return derived(this._values, $values => this.unwrap($values))
      .subscribe(...arguments)
  }

  watch (id) {
    return derived(this._values, $values => this.unwrap($values)[id])
  }

  _error (msg) {
    throw Error(`${this._name} :: ${msg}`)
  }

  destroy () {
    this._parent = null
    this._registry.clear()
    this._values.set({})
  }
}
