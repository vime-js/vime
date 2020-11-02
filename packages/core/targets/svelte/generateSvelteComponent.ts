import type { ComponentCompilerMeta } from '@stencil/core/internal';
import { generateImports, safeDefaultValue } from '../targetHelpers';
import { ComponentBindingConfig } from './SvelteTargetConfig';

export const generateSvelteComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
  bindingsConfig?: ComponentBindingConfig[],
) => {
  const {
    tagName, properties, methods, events,
  } = cmpMeta;

  const bindings = bindingsConfig
    ?.filter((c) => (
      Array.isArray(c.elements) ? c.elements.includes(tagName) : (c.elements === tagName)
    ))
    .filter((c1, index, self) => index === self.findIndex((c2) => (
      (c1.event === c2.event) && (c1.targetProp === c2.targetProp)
    )))
    .map((c) => `if (e.type === '${c.event}') { ${c.targetProp} = e.detail; }`)
    .join('\n  ');

  return `
<script context="module">
${generateImports(cmpMeta, components)}
</script>

<script>
import { createEventDispatcher, onMount } from 'svelte';
import { setProp } from '../lib';

let __ref;
let __mounted = false;

const dispatch = createEventDispatcher();

${
  properties
    .map((prop) => `export let ${prop.name}${!prop.required ? ` = ${safeDefaultValue(prop.defaultValue) ? prop.defaultValue : 'undefined'}` : ''};`).join('\n')
}
${
  methods
    .map((method) => `export const ${method.name} = (...args) => __ref.${method.name}(...args);`)
    .join('\n')
}
export const ref = () => __ref;
export const getWebComponent = () => __ref;

onMount(() => { 
  ${
  properties
    .filter((prop) => !safeDefaultValue(prop.defaultValue))
    .map((prop) => `${prop.name} = (${prop.name} === void 0) ? __ref['${prop.name}'] : ${prop.name};`).join('\n  ')
}

  __mounted = true; 
});

${
  properties
    .filter((prop) => !prop.attribute)
    .map((prop) => `$: if (__mounted) setProp(__ref, '${prop.name}', ${prop.name});`)
    .join('\n')
}

const onEvent = (e) => {
  e.stopPropagation();
  dispatch(e.type, e.detail);${bindings ? `\n  ${bindings}` : ''}
};
</script>

<${tagName} 
  ${properties
    .filter((prop) => !!prop.attribute)
    .map((prop) => `${prop.attribute}={${prop.name}}`).join('\n  ')}
  ${events
    .map((event) => `on:${event.name}={onEvent}`).join('\n  ')}
  bind:this={__ref}
>
  <slot></slot>
</${tagName}>
  `;
};
