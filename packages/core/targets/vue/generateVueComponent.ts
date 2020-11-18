import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../../src/utils/string';
import { generateImports, ignoreChecks } from '../targetHelpers';

export const generateVueComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const {
    tagName, properties, methods, events,
  } = cmpMeta;

  return `
${ignoreChecks()}
import Vue, { PropOptions } from 'vue';
import { method, render } from '../lib';
import type { Components } from '@vime/core/dist/types';
${generateImports(cmpMeta, components)}

export default Vue.extend({
  props: {
    ${properties
    .map((prop) => `${prop.name}: {} as PropOptions<Components.${displayName}['${prop.name}']>,`).join('\n    ')}
  },
  methods: {
    ${methods
    .map((method) => `${method.name}: method('${method.name}') as Components.${displayName}["${method.name}"],`)
    .join('\n    ')}
  },
  render: render('${tagName}', [${events.map((event) => `'${event.name}'`)}]),
});
  `;
};
