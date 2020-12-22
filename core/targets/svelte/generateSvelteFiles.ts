import { ComponentCompilerMeta } from '@stencil/core/internal';
import { SvelteTargetConfig } from './SvelteTargetConfig';
import { generateSvelteComponent } from './generateSvelteComponent';
import {
  buildExports, buildImports, fileName, ignoreChecks,
} from '../targetHelpers';

const svelte = require('svelte/compiler');

export const generateSvelteFiles = async (
  outputTarget: SvelteTargetConfig,
  components: ComponentCompilerMeta[],
) => {
  const entry = [
    ignoreChecks(),
    buildImports(components),
    buildExports(components),
  ].join('\n');

  const uncompiledFiles = components.map((c) => ({
    name: fileName(c),
    meta: c,
    content: generateSvelteComponent(c, components, outputTarget.componentBindings),
  }));

  const uncompiledEntry = [
    ignoreChecks(),
    buildImports(components, '.svelte'),
    buildExports(components),
  ].join('\n');

  const compiledFiles = uncompiledFiles.map((file) => ({
    name: file.name,
    meta: file.meta,
    content: svelte.compile(file.content, {
      name: file.name,
      css: false,
      preserveComments: true,
      outputFilename: file.name,
    }).js.code,
  }));

  return {
    entry,
    uncompiledEntry,
    uncompiledFiles,
    compiledFiles,
  };
};
