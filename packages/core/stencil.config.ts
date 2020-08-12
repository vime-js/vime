import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'Vime',
  taskQueue: 'async',
  buildEs5: false,
  globalStyle: 'src/globals/theme.css',
  extras: {
    cssVarsShim: false,
    dynamicImportShim: false,
    safari10: false,
    scriptDataOpts: false,
    shadowDomShim: false,
  },
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/globals/variables.scss',
        'src/globals/mixins.scss',
      ],
    }),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'docs-readme',
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
  preamble: '(C) Vime https://vime-js.com - MIT License',
};
