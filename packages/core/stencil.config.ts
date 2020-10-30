import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { svelteOutputTarget } from '@stencil/svelte-output-target';
import { generateSiteDocs } from './scripts/site-docs';

export const config: Config = {
  namespace: 'Vime',
  taskQueue: 'async',
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/globals/variables.scss',
        'src/globals/mixins.scss',
      ],
    }),
  ],
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@vime/core',
      proxiesFile: '../react/src/components.ts',
    }),
    vueOutputTarget({
      componentCorePackage: '@vime/core',
      proxiesFile: '../vue/src/components.ts',
    }),
    angularOutputTarget({
      componentCorePackage: '@vime/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
    }),
    svelteOutputTarget({
      componentCorePackage: '@vime/core',
      proxiesFile: '../svelte/src/components.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-custom',
      generator: generateSiteDocs,
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
