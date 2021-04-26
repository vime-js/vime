import { ComponentCompilerMeta } from '@stencil/core/internal';

import {
  buildExports,
  buildImports,
  fileName,
  ignoreChecks,
} from '../../../src/utils/target';
import { generateVueComponent } from './generateVueComponent';

export const generateVueFiles = async (cmps: ComponentCompilerMeta[]) => {
  const ignoreElements = `
import Vue from 'vue';

const vimeTags = [
  ${cmps.map(cmp => `'${cmp.tagName}',`).join('\n  ')}
];

Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...vimeTags];
`;

  const entry = [
    ignoreChecks(),
    ignoreElements,
    buildImports(cmps),
    buildExports(cmps),
  ].join('\n');

  const components = cmps.map(c => ({
    name: fileName(c),
    meta: c,
    content: generateVueComponent(c, cmps),
  }));

  return { entry, components };
};
