import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../../src/utils/string';
import { fileName, generateImports, ignoreChecks } from '../targetHelpers';

export const generateReactComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const name = fileName(cmpMeta);
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const { tagName } = cmpMeta;

  return `
${ignoreChecks()}
import React, { ReactNode, HTMLAttributes } from 'react';
import { createComponent } from '../lib';
import type { JSX } from '@vime/core/dist/types';
${generateImports(cmpMeta, components)}

export interface ${name}Props extends JSX.${displayName}, HTMLAttributes<HTML${displayName}Element> {
  children?: ReactNode | ReactNode[]
};

export default createComponent<HTML${displayName}Element, ${name}Props>(
  '${tagName}',
  new Set(${cmpMeta.properties.map((prop) => `'${prop.name}'`).join(',')}),
);
  `;
};
