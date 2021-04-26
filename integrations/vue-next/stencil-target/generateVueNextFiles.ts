import { ComponentCompilerMeta } from '@stencil/core/internal';

import {
  buildExports,
  buildImports,
  fileName,
  ignoreChecks,
} from '../../../src/utils/target';
import { generateVueNextComponent } from './generateVueNextComponent';

export const generateVueNextFiles = async (cmps: ComponentCompilerMeta[]) => {
  const entry = [ignoreChecks(), buildImports(cmps), buildExports(cmps)].join(
    '\n',
  );

  const components = cmps.map(c => ({
    name: fileName(c),
    meta: c,
    content: generateVueNextComponent(c, cmps),
  }));

  return { entry, components };
};
