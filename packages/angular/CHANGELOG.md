# 🤖 Changelog

All notable changes will be listed here.

# [2.0.0](https://github.com/vime-js/vime/compare/@vime/angular@1.6.0...@vime/angular@2.0.0) (2020-09-03)


### Bug Fixes

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

## [1.5.1](https://github.com/vime-js/vime/compare/@vime/angular@1.5.0...@vime/angular@1.5.1) (2020-08-28)

### Bug Fixes

- clean up changelogs ([8be2f7e](https://github.com/vime-js/vime/commit/8be2f7ece922c9cad34f6ce5790d493c05de93e0))

# [1.5.0](https://github.com/vime-js/vime/compare/@vime/angular@1.4.0...@vime/angular@1.5.0) (2020-08-28)

### Features

- **svelte:** all new svelte bindings ([59e0c23](https://github.com/vime-js/vime/commit/59e0c235c52d89331f88d8a6d8195b2d8de17c89))

# [1.4.0](https://github.com/vime-js/vime/compare/@vime/angular@1.3.0...@vime/angular@1.4.0) (2020-08-25)

### Features

- improve all framework integrations ([0ef1716](https://github.com/vime-js/vime/commit/0ef171655e8f02c277e0f00e90d87fdba8f74bb4))
- new svelte store option ([ce78e15](https://github.com/vime-js/vime/commit/ce78e1532da638fffacdf6988ec66c9390c31f5d))

# [1.3.0](https://github.com/vime-js/vime/compare/@vime/angular@1.2.0...@vime/angular@1.3.0) (2020-08-23)

### Features

- you can now build custom ui components + new react hooks ([0cde356](https://github.com/vime-js/vime/commit/0cde3563f868eeb405bbb17be8138b2044d55f3d))

# [1.2.0](https://github.com/vime-js/vime/compare/@vime/angular@1.1.0...@vime/angular@1.2.0) (2020-08-19)

### Features

- **core:** create themes dir and split default/light themes ([fd97368](https://github.com/vime-js/vime/commit/fd97368afd3fed4726352fd31ce733bc7f5b8e4d))

# [1.1.0](https://github.com/vime-js/vime/compare/@vime/angular@1.0.0...@vime/angular@1.1.0) (2020-08-17)

### Bug Fixes

- all event names should be prefixed with v ([3bf4742](https://github.com/vime-js/vime/commit/3bf4742ff89f04d5664f341da8acb021ee279eca))

### Features

- **core:** @stencil/core@2.0.0-3 ([09557d1](https://github.com/vime-js/vime/commit/09557d15ef9cc4a8a012e1104381f04b4a34848e))

# 1.0.0 (2020-08-14)

### Bug Fixes

- **angular:** release script broken ([57317c9](https://github.com/vime-js/vime/commit/57317c962875324542ab94fd74d38078ad55cbf1))

### Features

- **angular:** create angular bindings/package ([ed03bb0](https://github.com/vime-js/vime/commit/ed03bb0a33277f4babba7e4671b491a8f1fc71e3))
- **react:** add react bindings for vime ([8f1543b](https://github.com/vime-js/vime/commit/8f1543b7309d0cd96e45afd7f7abd5b20d2597d0))
