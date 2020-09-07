# 🤖 Changelog

All notable changes will be listed here.

## [2.0.2](https://github.com/vime-js/vime/compare/@vime/react@2.0.1...@vime/react@2.0.2) (2020-09-07)


### Bug Fixes

* force native controls if custom ui cannot be shown ([2dac2e1](https://github.com/vime-js/vime/commit/2dac2e1fa2715851ab9fb0af4b4dcf18da2db746))
* make direct adapter calls when playback ready ([c45a548](https://github.com/vime-js/vime/commit/c45a548ae39254704c8feca9d1cbeb087a3e3c7c))
* settings has no bg color ([fd5a35e](https://github.com/vime-js/vime/commit/fd5a35e0c36730df224df9bf60e7470d9a911a54))
* throw error when `findRootPlayer` fails ([7a69721](https://github.com/vime-js/vime/commit/7a69721b898fbfe79878ff0abbc4a5ebeb2a1274))
* **angular:** silence implicit any errors ([8ef955b](https://github.com/vime-js/vime/commit/8ef955b05b652f557687b0eab72327236fb187cf))
* **svelte:** should import player store from dist ([93ebcbf](https://github.com/vime-js/vime/commit/93ebcbf6b1d4bfcfa2d906ac33a08188b73c0733))
* type error thrown when ui root not found ([6f0a19e](https://github.com/vime-js/vime/commit/6f0a19e1701381d4052d66d34826602fad8151a5))

## [2.0.1](https://github.com/vime-js/vime/compare/@vime/react@2.0.0...@vime/react@2.0.1) (2020-09-05)


### Bug Fixes

* packages should use @vime/core@^2 ([ec5cebd](https://github.com/vime-js/vime/commit/ec5cebda41e67d5d10ba5cdfe8308ca7d9a660b3))

# [2.0.0](https://github.com/vime-js/vime/compare/@vime/react@1.8.0...@vime/react@2.0.0) (2020-09-03)


### Bug Fixes

* cleanup internals and integrations ([1eda6b3](https://github.com/vime-js/vime/commit/1eda6b379dc4ad5829906fdb472a5a51a3c9090a))


### BREAKING CHANGES

* export changes listed below.

- `PlayerProp` is now a type (union of strings) and not enum.
- `PlayerEvent` is now a type (union of strings) and not enum.
- `useInternalPlayerContext` has been removed from `@vime/react`.
- `useInternalPlayerStore` has been removed from `@vime/svelte`.
- Providers dispatch changes in a separate event (`vProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.

## [1.7.1](https://github.com/vime-js/vime/compare/@vime/react@1.7.0...@vime/react@1.7.1) (2020-08-28)

### Bug Fixes

- clean up changelogs ([8be2f7e](https://github.com/vime-js/vime/commit/8be2f7ece922c9cad34f6ce5790d493c05de93e0))

# [1.7.0](https://github.com/vime-js/vime/compare/@vime/react@1.6.0...@vime/react@1.7.0) (2020-08-28)

### Features

- **svelte:** all new svelte bindings ([59e0c23](https://github.com/vime-js/vime/commit/59e0c235c52d89331f88d8a6d8195b2d8de17c89))

# [1.5.0](https://github.com/vime-js/vime/compare/@vime/react@1.4.0...@vime/react@1.5.0) (2020-08-25)

### Features

- export findRootPlayer utility ([f4ccab1](https://github.com/vime-js/vime/commit/f4ccab104a5ab845b71f51a5ae5fa9b095d7cb5e))
- improve all framework integrations ([0ef1716](https://github.com/vime-js/vime/commit/0ef171655e8f02c277e0f00e90d87fdba8f74bb4))
- new svelte store option ([ce78e15](https://github.com/vime-js/vime/commit/ce78e1532da638fffacdf6988ec66c9390c31f5d))
- **react:** export player event enum ([eebcda8](https://github.com/vime-js/vime/commit/eebcda8567523ba6463d27cdd393842dffa03d39))

# [1.4.0](https://github.com/vime-js/vime/compare/@vime/react@1.3.0...@vime/react@1.4.0) (2020-08-23)

### Features

- you can now build custom ui components + new react hooks ([0cde356](https://github.com/vime-js/vime/commit/0cde3563f868eeb405bbb17be8138b2044d55f3d))

# [1.3.0](https://github.com/vime-js/vime/compare/@vime/react@1.2.0...@vime/react@1.3.0) (2020-08-19)

### Features

- **core:** create themes dir and split default/light themes ([fd97368](https://github.com/vime-js/vime/commit/fd97368afd3fed4726352fd31ce733bc7f5b8e4d))

# [1.2.0](https://github.com/vime-js/vime/compare/@vime/react@1.1.0...@vime/react@1.2.0) (2020-08-14)

### Features

- **angular:** create angular bindings/package ([ed03bb0](https://github.com/vime-js/vime/commit/ed03bb0a33277f4babba7e4671b491a8f1fc71e3))

# [1.1.0](https://github.com/vime-js/vime/compare/@vime/react@1.0.0...@vime/react@1.1.0) (2020-08-14)

### Features

- **vue:** create vue bindings/package ([f162808](https://github.com/vime-js/vime/commit/f1628087df85b02a73a22e9813cacb64b7848b37))

# 1.0.0 (2020-08-13)

### Features

- **react:** add react bindings for vime ([8f1543b](https://github.com/vime-js/vime/commit/8f1543b7309d0cd96e45afd7f7abd5b20d2597d0))
