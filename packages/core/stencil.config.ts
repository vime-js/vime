import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'Vime',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
  ],
  testing: {
    allowableMismatchedPixels: 200,
    pixelmatchThreshold: 0.05,
    waitBeforeScreenshot: 20,
    browserExecutablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    emulate: [
      {
        userAgent: 'Chrome',
        viewport: {
          width: 1280,
          height: 800,
        }
      },
      {
        userAgent: 'Chrome',
        viewport: {
          width: 768,
          height: 800,
        }
      },
      {
        userAgent: 'iPhone',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
        }
      },
      {
        userAgent: 'Android',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
        }
      },
    ]
  },
  preamble: '(C) Vime https://vime-js.com - MIT License'
};
