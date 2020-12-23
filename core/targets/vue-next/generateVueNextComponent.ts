import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../../src/utils/string';
import { defineAllDependencies, ignoreChecks, importAllDepdencies } from '../targetHelpers';

export const generateVueNextComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const { tagName, methods, events } = cmpMeta;
  const eventsList = `[${events.map((event) => `'${event.name}'`)}]`;

  return `
${ignoreChecks()}
import { defineComponent } from 'vue';
import { method, render } from '../lib';
import type { JSX, Components } from '@vime/core/dist/types';
${importAllDepdencies(cmpMeta, components)}
${defineAllDependencies(cmpMeta, components)}

export default defineComponent<JSX.${displayName}, {}, {}, {}, {
  ${methods
    .map((method) => `${method.name}: Components.${displayName}["${method.name}"]`)
    .join('\n  ')}
}>({
  emits: ${eventsList},
  methods: {
    ${methods
    .map((method) => `${method.name}: method('${method.name}'),`)
    .join('\n    ')}
  },
  render: render('${tagName}', ${eventsList}),
});
  `;
};
