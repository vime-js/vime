import { ComponentCompilerMeta } from '@stencil/core/internal';

import {
  buildExports,
  buildImports,
  fileName,
  ignoreChecks,
} from '../../src/utils/target';
import { generateReactComponent } from './generateReactComponent';

export const generateReactFiles = async (cmps: ComponentCompilerMeta[]) => {
  const entry = [ignoreChecks(), buildImports(cmps), buildExports(cmps)].join(
    '\n',
  );

  const components = cmps.map(c => ({
    name: fileName(c),
    meta: c,
    content: generateReactComponent(c, cmps),
  }));

  return { entry, components };
};
