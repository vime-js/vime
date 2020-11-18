import { Config } from '@stencil/core';
import { svelteOutputTarget } from './targets/svelte';
import { reactOutputTarget } from './targets/react';
import { angularOutputTarget } from './targets/angular';
import { vueOutputTarget } from './targets/vue';
import { vueNextOutputTarget } from './targets/vue-next';
import { siteDocsOutputTarget } from './targets/site-docs';

export const config: Config = {
  namespace: 'Vime',
  taskQueue: 'async',
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
    setupFilesAfterEnv: [
      './src/globals/jest.js',
    ],
    coverageDirectory: 'jest-coverage',
    // @ts-ignore
    watchPlugins: [
      'jest-watch-typeahead/filename',
      'jest-watch-typeahead/testname',
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/cypress/',
    ],
  },
  preamble: '(C) Vime https://vimejs.com - MIT License',
};
