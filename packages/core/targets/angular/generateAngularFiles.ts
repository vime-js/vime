import { ComponentCompilerMeta } from '@stencil/core/internal';
import { fileName, ignoreChecks } from '../targetHelpers';
import { generateAngularComponent } from './generateAngularComponent';

export const generateAngularFiles = async (cmps: ComponentCompilerMeta[]) => {
  const entry = [
    ignoreChecks(),
    cmps.map((cmp) => `export { ${fileName(cmp)} } from './components/${fileName(cmp)}';`).join('\n'),
  ].join('\n');

  const module = `
${ignoreChecks()}
import { NgModule } from '@angular/core';

import {
  ${cmps.map((cmp) => `${fileName(cmp)},`).join('\n  ')}
} from './components';

const DECLARATIONS = [
  ${cmps.map((cmp) => `${fileName(cmp)},`).join('\n  ')}
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [],
  providers: [],
})
export class VimeModule {}
  `;

  const components = cmps.map((c) => ({
    name: fileName(c),
    meta: c,
    content: generateAngularComponent(c, cmps),
  }));

  return { entry, module, components };
};
