import { Registry } from '@vime-js/complete';

import {
  is_number, is_function, is_boolean,
  is_object, is_array, is_svelte_instance,
  is_element, is_svelte_component, is_instance_of,
  is_async_function,
} from '@vime-js/utils';

export const is_getter_method = (methodName, value) => {
  const validPrefixes = ['get', 'is', 'has', 'can', 'should', 'use'];
  return (is_function(value) || is_async_function(value))
    && validPrefixes.some((prefix) => methodName.startsWith(prefix));
};

export const is_readonly_prop = (value) => is_function(value)
  || is_svelte_instance(value)
  || is_element(value);

export const is_setter_method = (methodName, value) => {
  const validPrefixes = ['set', 'send', 'request', 'exit', 'create', 'tick', 'dispose'];
  return (is_function(value) || is_async_function(value))
    && validPrefixes.some((prefix) => methodName.startsWith(prefix));
};

export const infer_prop_type = (value) => {
  if (is_boolean(value)) { return 'boolean'; }
  if (is_number(value)) { return 'number'; }
  if ((is_object(value) || is_array(value))) { return 'json'; }
  return 'text';
};

export const is_plugin = (value) => value
  && (value.id || value.ID)
  && (value.plugin || value.default);

export const format_name = (name) => (name.includes('_svelte') ? name.match(/_svelte_(.+)/)[1] : name);

export const extract_prop_value = (value) => {
  if (is_svelte_component(value)) { return `${format_name(value.name)} Component`; }
  if (is_svelte_instance(value)) { return `${format_name(value.constructor.name)} Instance`; }
  if (is_instance_of(value, Registry)) { return `${value.getId()} Registry`; }
  if (is_element(value)) { return `${value.tagName} Element`; }
  if (is_function(value)) { return 'Function'; }
  if (is_async_function(value)) { return 'Async Function'; }
  return value;
};

export const format_prop_value = (value) => {
  const result = {};
  if (is_object(value)) {
    Object.keys(value).forEach((id) => {
      const child = value[id];
      result[id] = (is_object(child) || is_array(child))
        ? format_prop_value(child)
        : extract_prop_value(child);
    });
    return result;
  }
  if (is_array(value)) return value.map(format_prop_value);
  return extract_prop_value(value);
};
