import { writable, readable, get } from 'svelte/store';

import {
  is_instance_of, try_create_svelte_dispatcher, try_on_svelte_destroy,
  on_svelte_instance_destroy
} from '@vime/utils';

export default class Registry {
  constructor (name) {
    this._name = name + 'Registry';
    this._registry = new Set();
    this._values = writable({});
    this._parent = null;
    this._dispatch = try_create_svelte_dispatcher();
    try_on_svelte_destroy(() => this.destroy());
  }

  name () {
    return this._name;
  }

  registrations () {
    return Array.from(this._registry.values());
  }

  value (id) {
    return get(this._values)[id];
  }

  values () {
    return get(this._values);
  }

  has (id) {
    return this._registry.has(id);
  }

  register (id, value) {
    if (!id) this._error('registration failed because `id` is missing');
    if (this.has(id)) this._error(`attempted to register with \`id\` [${id}] but it is taken`);
    this._registry.add(id);
    this._values.update($values => ({ ...$values, [id]: value }));
    on_svelte_instance_destroy(value, () => this.deregister(id));
    if (is_instance_of(value, Registry)) value._parent = this;
    this._dispatch('register', { id, value });
    this._invalidateParent();
  }

  _invalidateParent () {
    if (this._parent) {
      this._parent._values.update(v => v);
      this._parent._invalidateParent();
    }
  }

  update (id, value) {
    if (!this.has(id)) this._error(`attempted to update an unregistered value with \`id\` [${id}]`);
    this._values.update($values => ({ ...$values, [id]: value }));
    this._invalidateParent();
  }

  deregister (id) {
    if (!this.has(id)) return;
    this._registry.delete(id);
    this._values.update($values => {
      delete $values[id];
      return $values;
    });
    this._dispatch('deregister', id);
    this._invalidateParent();
  }

  unwrap (values) {
    const result = {};
    Object.keys(values).forEach(id => {
      const value = values[id];
      result[id] = is_instance_of(value, Registry) ? this.unwrap(value.values()) : value;
    });
    return result;
  }

  toStore (id) {
    return readable({}, set => this._values.subscribe($values => {
      const values = this.unwrap($values);
      set(id ? values[id] : values);
    }));
  }

  _error (msg) {
    throw Error(`${this._name} :: ${msg}`);
  }

  destroy () {
    this._parent = null;
    this._registry.clear();
    this._values.set({});
  }
}
