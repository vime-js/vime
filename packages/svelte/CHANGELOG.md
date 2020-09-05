# 🤖 Changelog

All notable changes will be listed here.

## [2.1.1](https://github.com/vime-js/vime/compare/@vime/svelte@2.1.0...@vime/svelte@2.1.1) (2020-09-05)


### Bug Fixes

* packages should use @vime/core@^2 ([ec5cebd](https://github.com/vime-js/vime/commit/ec5cebda41e67d5d10ba5cdfe8308ca7d9a660b3))

# [2.1.0](https://github.com/vime-js/vime/compare/@vime/svelte@2.0.0...@vime/svelte@2.1.0) (2020-09-04)


### Features

* skeleton loading animation ([0a36998](https://github.com/vime-js/vime/commit/0a369988be1c5e45674853cf55326c15b755839e))

# [2.0.0](https://github.com/vime-js/vime/compare/@vime/svelte@1.2.0...@vime/svelte@2.0.0) (2020-09-03)


### Bug Fixes

* **core/default-controls:** no scrim on desktop video when using light theme ([b94922d](https://github.com/vime-js/vime/commit/b94922db2e1c775838fcee3bb01c8ccd4a695129))
* cleanup internals and integrations ([1eda6b3](https://github.com/vime-js/vime/commit/1eda6b379dc4ad5829906fdb472a5a51a3c9090a))


### Features

* simplify control/icon styling ([f73ead8](https://github.com/vime-js/vime/commit/f73ead8703a9f00c3f308d9a0cc344709769d88b))


### BREAKING CHANGES

* export changes listed below.

- `PlayerProp` is now a type (union of strings) and not enum.
- `PlayerEvent` is now a type (union of strings) and not enum.
- `useInternalPlayerContext` has been removed from `@vime/react`.
- `useInternalPlayerStore` has been removed from `@vime/svelte`.
- Providers dispatch changes in a separate event (`vProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.

## [1.1.1](https://github.com/vime-js/vime/compare/@vime/svelte@1.1.0...@vime/svelte@1.1.1) (2020-08-28)

### Bug Fixes

- clean up changelogs ([8be2f7e](https://github.com/vime-js/vime/commit/8be2f7ece922c9cad34f6ce5790d493c05de93e0))

# [1.1.0](https://github.com/vime-js/vime/compare/@vime/svelte@1.0.0...@vime/svelte@1.1.0) (2020-08-28)

### Features

- **svelte:** all new svelte bindings ([59e0c23](https://github.com/vime-js/vime/commit/59e0c235c52d89331f88d8a6d8195b2d8de17c89))
- **svelte:** new usePlayer helper ([ce56b1c](https://github.com/vime-js/vime/commit/ce56b1c847ff096dda0a4233b554030f1653c19c))

# 1.0.0 (2020-08-25)

### Features

- improve all framework integrations ([0ef1716](https://github.com/vime-js/vime/commit/0ef171655e8f02c277e0f00e90d87fdba8f74bb4))
- new svelte store option ([ce78e15](https://github.com/vime-js/vime/commit/ce78e1532da638fffacdf6988ec66c9390c31f5d))
