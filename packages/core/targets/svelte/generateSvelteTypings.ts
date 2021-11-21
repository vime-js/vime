import { ComponentCompilerMeta } from '@stencil/core/internal';

import { dashToPascalCase } from '../../src/utils/string';
import { jsxEventName } from '../../src/utils/target';

export const generateSvelteTypings = (meta: ComponentCompilerMeta) => {
  const name = dashToPascalCase(meta.tagName);

  const types = `
interface ${name}Props {
  class?: string
  style?: string
  ${meta.properties
    .map(
      prop =>
        `\n  /** ${prop.docs.text} */\n  ${prop.name}?: Components.${name}["${prop.name}"]`,
    )
    .join('\n  ')}
}
interface ${name}Events {
  ${meta.events
    .filter(event => !event.internal)
    .map(
      event =>
        `\n  /** ${event.docs.text} */\n  ${
          event.name
        }: Parameters<JSX.${name}["${jsxEventName(event.name)}"]>[0]`,
    )
    .join('\n  ')}
}
interface ${name}Slots {
  default: any
}
  `;

  return types;
};

export const generate$$TypeDefs = (
  meta: ComponentCompilerMeta,
  source: string,
) => {
  const name = dashToPascalCase(meta.tagName);

  const inject = [
    'extends SvelteComponent {',
    // For some reason n-1 $ signs appear in output...?
    `$$$prop_def: ${name}Props;`,
    `$$$events_def: ${name}Events;`,
    `$$$slot_def: ${name}Slots;\n`,
    `$on<K extends keyof ${name}Events>(type: K, callback: (e: ${name}Events[K]) => any): () => void {\n\t  return super.$on(type, callback);\n\t}\n`,
    `$set($$$props: Partial<${name}Props>): void {\n\t  super.$set($$$props);\n\t}\n`,
  ].join('\n  ');

  return source.replace('extends SvelteComponent {', inject);
};

export const replaceSvelteMethodDefs = (
  meta: ComponentCompilerMeta,
  source: string,
) => {
  const name = dashToPascalCase(meta.tagName);

  let newSource = source;

  newSource = source.replace(
    'get ref() {',
    `get ref(): HTML${name}Element | undefined {`,
  );
  newSource = source.replace(
    'get getWebComponent() {',
    `get getWebComponent(): HTML${name}Element | undefined {`,
  );

  meta.methods.forEach(method => {
    newSource = newSource.replace(
      `get ${method.name}() {`,
      `\n  /** ${method.docs.text} */\n get ${method.name}(): Components.${name}["${method.name}"] {`,
    );
  });

  return newSource;
};
