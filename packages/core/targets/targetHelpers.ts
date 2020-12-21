import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../src/utils/string';
import { sortBy } from '../src/utils/array';

export const ignoreChecks = () => [
  '/* eslint-disable */',
  '/* tslint:disable */',
  '// @ts-nocheck',
].join('\n');

export const fileName = (c: ComponentCompilerMeta) => dashToPascalCase(c.tagName).slice(2);

export const buildImports = (
  components: ComponentCompilerMeta[],
  ext = '',
  isDefaultExport = true,
) => components.map((c) => `import ${isDefaultExport ? `${fileName(c)}Proxy` : `{ ${fileName(c)} as ${fileName(c)}Proxy }`} from './${fileName(c)}${ext}';`).join('\n');

export const buildExports = (components: ComponentCompilerMeta[]) => components
  .map((c) => `export const ${fileName(c)} = /*#__PURE__*/${fileName(c)}Proxy;`).join('\n');

export const sortComponents = (cmps: ComponentCompilerMeta[]) => sortBy<ComponentCompilerMeta>(
  cmps,
  (cmp: ComponentCompilerMeta) => cmp.tagName,
);

export const jsxEventName = (eventName: string) => `on${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;

export const safeDefaultValue = (value?: string) => {
  try {
    // eslint-disable-next-line no-eval
    eval(value ?? '');
    return true;
  } catch (e) {
    return false;
  }
};

export const generateImports = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
  moreImports: string[] = [],
  importExt?: string,
) => {
  const getDeps = (tagName: string) => components
    .find((cmp) => cmp.tagName === tagName)
    ?.dependencies ?? [];

  const getAllImports = (tagName: string, imports: Set<string> = new Set()) => {
    imports.add(tagName);
    const deps = getDeps(tagName) ?? [];
    deps.forEach((dep) => { getAllImports(dep, imports); });
    return Array.from(imports);
  };

  const imports = getAllImports(cmpMeta.tagName)
    .map((tagName) => ({ tagName, className: dashToPascalCase(tagName) }));

  return `
import { 
  ${[...imports
    .map((i) => (importExt ? `${i.className} as ${i.className}${importExt}` : i.className)), ...moreImports]
    .join(',\n  ')} 
} from '@vime/core';

import { define } from '../lib';

${imports.map((cmp) => `define('${cmp.tagName}', ${cmp.className}${importExt ?? ''});`).join('\n')}
  `;
};
