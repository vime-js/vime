module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  globals: {
    // Jest (jest-svelte-events)
    listen: 'readonly'
  },
  extends: [
    'standard'
  ],
  plugins: [
    'svelte3'
  ],
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  rules: {
    'max-len': ['warn', { 'code': 100 }],
    'camelcase': 'off',
    // These plugins do not currently work with eslint-plugin-svelte3.
    'import/first': 'off',
    'import/no-duplicates': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',
    'no-unused-vars': 'off',
    // Emits error when using multiple script tags.
    'no-multiple-empty-lines': 'off'
  },
  settings: {
    'svelte3/ignore-styles': (attrs) => attrs.type === 'text/scss',
  }
}
