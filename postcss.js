const autoprefixer = require('autoprefixer');
const customProperties = require('postcss-custom-properties');

// This file is imported by `rollup.config.js` and `.storybook/webpack.config.js`.
module.exports = (legacy = false) => ({
  plugins: [
    autoprefixer({
      overrideBrowserslist: legacy
        ? ['ie 11']
        : [
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Edge versions',
          'last 2 Safari versions',
          'last 2 Opera versions',
          'last 2 iOS versions',
        ],
    }),
    legacy && customProperties,
  ].filter(Boolean),
});
