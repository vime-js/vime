module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true
  },
  globals: {
    // Jest (jest-svelte-events)
    listen: 'readonly'
  },
  extends: ['eslint-config-airbnb-base'],
  plugins: ['svelte3'],
  overrides: [{
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
  }],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module'
  },
  settings: {
    'svelte3/ignore-styles': (attrs) => attrs.type === 'text/scss',
  },
  rules: {
    'no-unused-expressions': [2, { 'allowTernary': true }],
    // Utils use snakecase.
    'camelcase': 'off',
    // Doesn't work with Svelte.
    'no-multiple-empty-lines': 'off',
	    // These do not currently work with eslint-plugin-svelte3.
    'import/first': 'off',
    'import/order': 'off',
    'import/no-duplicates': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',	'require-atomic-updates': 'off',
  }
}
