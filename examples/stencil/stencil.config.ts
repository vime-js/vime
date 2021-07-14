import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.css',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
      baseUrl: 'https://myapp.local/',
      copy: [
        {
          src: '../node_modules/@vime/core/icons',
          dest: 'icons',
        },
      ],
    },
  ],
};
