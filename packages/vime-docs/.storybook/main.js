module.exports = {
  stories: [
    '../src/stories/**/*.stories.js',
    '../src/stories/**/*.stories.mdx'
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links/register',
    '@storybook/addon-viewport/register'
  ]
};