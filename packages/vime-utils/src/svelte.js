import { noop, run_all, SvelteComponent } from 'svelte/internal';
import { createEventDispatcher, onDestroy } from 'svelte';
import { is_instance_of } from './unit';

export const is_svelte_component = input => Boolean(
  input && is_instance_of(input.prototype, SvelteComponent)
);

export const try_create_svelte_dispatcher = () => {
  try {
    return createEventDispatcher();
  } catch (e) {
    return noop;
  }
};

export const try_on_svelte_destroy = cb => {
  try {
    onDestroy(cb);
  } catch (e) { 
    /** noop */ 
  }
};

export const on_svelte_instance_update = (instance, cb) => {
  if (!instance || !is_svelte_component(instance.constructor)) return;
  if (!instance.$$.after_update) instance.$$.after_update = [];
  instance.$$.after_update.push(cb);
};

export const on_svelte_instance_destroy = (instance, cb) => {
  if (!instance || !is_svelte_component(instance.constructor)) return;
  if (!instance.$$.on_destroy) instance.$$.on_destroy = [];
  instance.$$.on_destroy.push(cb);
};
