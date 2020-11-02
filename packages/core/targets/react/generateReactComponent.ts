import { ComponentCompilerMeta } from '@stencil/core/internal';
import { dashToPascalCase } from '../../src/utils/string';
import { generateImports, ignoreChecks } from '../targetHelpers';

export const generateReactComponent = (
  cmpMeta: ComponentCompilerMeta,
  components: ComponentCompilerMeta[],
) => {
  const displayName = dashToPascalCase(cmpMeta.tagName);
  const { tagName } = cmpMeta;

  return `
${ignoreChecks()}
import React, { ReactNode, HTMLAttributes } from 'react';
import { createComponent } from '../lib';
${generateImports(cmpMeta, components, ['JSX'])}

export interface ${displayName}Props extends JSX.${displayName}, HTMLAttributes<HTML${displayName}Element> {
  children?: ReactNode | ReactNode[]
};

export default createComponent<HTML${displayName}Element, ${displayName}Props>('${tagName}');
  `;
};
