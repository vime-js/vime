import { Config } from '@stencil/core';

import { siteDocsOutputTarget } from './docs/stencil-target';
import { angularOutputTarget } from './integrations/angular/stencil-target';
import { reactOutputTarget } from './integrations/react/stencil-target';
import { svelteOutputTarget } from './integrations/svelte/stencil-target';
import { vueOutputTarget } from './integrations/vue/stencil-target';
import { vueNextOutputTarget } from './integrations/vue-next/stencil-target';

export const config: Config = {
  namespace: 'Vime',
  taskQueue: 'async',
  tsconfig: 'tsconfig-build.json',
  outputTargets: [
    reactOutputTarget(),
    angularOutputTarget(),
    vueOutputTarget(),
    vueNextOutputTarget(),
    svelteOutputTarget(),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-custom',
      generator: siteDocsOutputTarget,
    },
  ],
  testing: {
    globals: {
      'ts-jest': {
        diagnostics: false,
      },
    },
    setupFilesAfterEnv: ['./src/globals/jest.js'],
    coverageDirectory: 'jest-coverage',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  },
  preamble: '(C) Vime https://vimejs.com - MIT License',
};
