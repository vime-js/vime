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
  extends: [
		'eslint:recommended',
		'plugin:import/errors',
		'plugin:import/warnings'
  ],
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
		indent: 'off',
		'no-unused-vars': 'off',
		semi: [2, 'always'],
		'keyword-spacing': [2, { before: true, after: true }],
		'space-before-blocks': [2, 'always'],
		'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
		'no-cond-assign': 0,
		'object-shorthand': [2, 'always'],
		'no-const-assign': 2,
		'no-class-assign': 2,
		'no-this-before-super': 2,
		'no-var': 2,
		'no-unreachable': 2,
		'valid-typeof': 2,
		'quote-props': [2, 'as-needed'],
		'one-var': [2, 'never'],
		'prefer-arrow-callback': 2,
		'prefer-const': [2, { destructuring: 'all' }],
		'arrow-spacing': 2,
		'no-inner-declarations': 0,
	    // These do not currently work with eslint-plugin-svelte3.
    'import/first': 'off',
    'import/no-duplicates': 'off',
    'import/no-mutable-exports': 'off',
    'import/no-unresolved': 'off',	'require-atomic-updates': 'off',
  }
}
