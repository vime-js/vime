import { ComponentCompilerMeta } from '@stencil/core/internal';

import { sortBy } from './array';
import { dashToPascalCase } from './string';

export const ignoreChecks = () =>
  ['/* eslint-disable */', '/* tslint:disable */', '// @ts-nocheck'].join('\n');

export const fileName = (c: ComponentCompilerMeta) =>
  dashToPascalCase(c.tagName).slice(2);

export const buildImports = (
  components: ComponentCompilerMeta[],
  ext = '',
  isDefaultExport = true,
) =>
  components
    .map(
      c =>
        `import ${
          isDefaultExport
            ? `${fileName(c)}Proxy`
            : `{ ${fileName(c)} as ${fileName(c)}Proxy }`
        } from './${fileName(c)}${ext}';`,
    )
    .join('\n');

export const buildExports = (components: ComponentCompilerMeta[]) =>
  components
    .map(c => `export const ${fileName(c)} = /*#__PURE__*/${fileName(c)}Proxy;`)
    .join('\n');

export const sortComponents = (cmps: ComponentCompilerMeta[]) =>
  sortBy<ComponentCompilerMeta>(
    cmps,
    (cmp: ComponentCompilerMeta) => cmp.tagName,
  );

export const jsxEventName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;

export const safeDefaultValue = (value?: string) => {
  try {
    // eslint-disable-next-line no-eval
    eval(value ?? '');
    return true;
  } catch (e) {
    return false;
  }
};

export const findAllDependencies = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const getDirectDeps = (tagName: string) =>
    components.find(cmp => cmp.tagName === tagName)?.dependencies ?? [];

  const getDepTree = (tagName: string, imports: Set<string> = new Set()) => {
    imports.add(tagName);
    const deps = getDirectDeps(tagName) ?? [];
    deps.forEach(dep => {
      getDepTree(dep, imports);
    });
    return Array.from(imports);
  };

  return getDepTree(cmpMeta.tagName).map(tagName => ({
    tagName,
    className: dashToPascalCase(tagName),
  }));
};

export const importAllDepdencies = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const deps = findAllDependencies(cmpMeta, components);
  return `
import { 
  ${[...deps.map(i => i.className)].join(',\n  ')} 
} from '@vime/core';

import { define } from '../lib';
  `;
};

export const defineAllDependencies = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const deps = findAllDependencies(cmpMeta, components);

  return `
${deps.map(cmp => `define('${cmp.tagName}', ${cmp.className});`).join('\n')}
  `;
};
