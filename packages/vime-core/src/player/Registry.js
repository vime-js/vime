import { writable, derived, get } from 'svelte/store';

import {
  is_instance_of, try_create_svelte_dispatcher, try_on_svelte_destroy,
  on_svelte_instance_destroy, is_null
} from '@vime/utils';

// TODO: needs work.
export default class Registry {
  constructor (id, validator) {
    this._id = id;
    this._name = id + 'Registry';
    this._validator = validator || (() => true);
    this._registry = new Set();
    this._values = writable({});
    this._parent = null;
    this._dispatch = try_create_svelte_dispatcher();
    try_on_svelte_destroy(() => this.destroy());
  }

  _error (msg) {
    throw Error(`${this._name} :: ${msg}`);
  }

  _invalidateParent () {
    if (this._parent && !this._parent._destroyed) {
      this._parent._values.update(v => v);
      this._parent._invalidateParent();
    }
  }

  _unwrap (values) {
    const result = {};
    Object.keys(values).forEach(id => {
      const value = values[id];
      result[id] = is_instance_of(value, Registry) ? this._unwrap(value.getValues()) : value;
    });
    return result;
  }

  getId () {
    return this._id;
  }

  getName () {
    return this._name;
  }

  getRegistrations () {
    return Array.from(this._registry.values());
  }

  getValue (id) {
    return get(this._values)[id];
  }

  getValues () {
    return get(this._values);
  }

  has (id) {
    return this._registry.has(id);
  }

  invalidate () {
    this._values.update(v => v);
    this._invalidateParent();
  }

  register (id, value) {
    if (!id) this._error('registration failed because `id` is missing');
    if (this.has(id)) this._error(`attempted to register with \`id\` [${id}] but it is taken`);
    if (!this._validator(id, value)) return;
    this._registry.add(id);
    this._values.update($values => ({ ...$values, [id]: value }));
    on_svelte_instance_destroy(value, () => this.deregister(id));
    if (is_instance_of(value, Registry)) value._parent = this;
    this._dispatch('register', { id, value });
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

  subscribe () {
    return derived(this._values, $values => this._unwrap($values)).subscribe(...arguments);
  }

  destroy () {
    if (is_null(this._registry)) return;
    this.getRegistrations().forEach(id => this.deregister(id));
    if (this._parent && !this._parent._destroyed) this._parent.deregister(this.getId());
    this._destroyed = true;
  }
}
