module.exports = {
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    'jest-svelte-events/extend-expect'
  ],
  collectCoverageFrom: [
    "packages/*/src/**/*.js",
    "packages/*/src/**/*.svelte"
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.svelte$': [
      'svelte-jester',
      {
        preprocess: true
      }
    ],
    '^.+\\.svg$': 'jest-svg-transformer'
  },
  moduleFileExtensions: [
    'js',
    'svelte'
  ],
  testEnvironment: 'jest-environment-jsdom-fifteen',
  testEnvironmentOptions: {
    resources: 'usable'
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
}
