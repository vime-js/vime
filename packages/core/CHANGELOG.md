# 🤖 Changelog

All notable changes will be listed here.

## [2.1.1](https://github.com/vime-js/vime/compare/@vime/core@2.1.0...@vime/core@2.1.1) (2020-09-07)


### Bug Fixes

* force native controls if custom ui cannot be shown ([2dac2e1](https://github.com/vime-js/vime/commit/2dac2e1fa2715851ab9fb0af4b4dcf18da2db746))
* make direct adapter calls when playback ready ([c45a548](https://github.com/vime-js/vime/commit/c45a548ae39254704c8feca9d1cbeb087a3e3c7c))
* packages should use @vime/core@^2 ([ec5cebd](https://github.com/vime-js/vime/commit/ec5cebda41e67d5d10ba5cdfe8308ca7d9a660b3))
* settings has no bg color ([fd5a35e](https://github.com/vime-js/vime/commit/fd5a35e0c36730df224df9bf60e7470d9a911a54))
* throw error when `findRootPlayer` fails ([7a69721](https://github.com/vime-js/vime/commit/7a69721b898fbfe79878ff0abbc4a5ebeb2a1274))
* **angular:** silence implicit any errors ([8ef955b](https://github.com/vime-js/vime/commit/8ef955b05b652f557687b0eab72327236fb187cf))
* **svelte:** should import player store from dist ([93ebcbf](https://github.com/vime-js/vime/commit/93ebcbf6b1d4bfcfa2d906ac33a08188b73c0733))
* type error thrown when ui root not found ([6f0a19e](https://github.com/vime-js/vime/commit/6f0a19e1701381d4052d66d34826602fad8151a5))

# [2.1.0](https://github.com/vime-js/vime/compare/@vime/core@2.0.0...@vime/core@2.1.0) (2020-09-04)


### Features

* skeleton loading animation ([0a36998](https://github.com/vime-js/vime/commit/0a369988be1c5e45674853cf55326c15b755839e))

# [2.0.0](https://github.com/vime-js/vime/compare/@vime/core@1.11.0...@vime/core@2.0.0) (2020-09-03)


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

# [1.10.0](https://github.com/vime-js/vime/compare/@vime/core@1.9.0...@vime/core@1.10.0) (2020-08-28)

### Bug Fixes

- **svelte:** incorrect event types ([5f10525](https://github.com/vime-js/vime/commit/5f10525c3b8cfc915c40f026e46d5d63396ddce5))

### Features

- **svelte:** all new svelte bindings ([59e0c23](https://github.com/vime-js/vime/commit/59e0c235c52d89331f88d8a6d8195b2d8de17c89))

# [1.9.0](https://github.com/vime-js/vime/compare/@vime/core@1.8.1...@vime/core@1.9.0) (2020-08-25)

### Bug Fixes

- stricter typing on player context ([e2dc6d6](https://github.com/vime-js/vime/commit/e2dc6d665535f9f35e0128132e172587924de2bb))
- use lower case `PlayerProp` names for consistency ([5be3890](https://github.com/vime-js/vime/commit/5be3890de1acd8988031cfa6310799dcdd2aeb82))
- usePlayerContext not working if used on same ref ([2a9c881](https://github.com/vime-js/vime/commit/2a9c881a1646ffd2fa0ea7eb6095f41b990551f7))
- **core:** context connection failing if player ready ([2443817](https://github.com/vime-js/vime/commit/244381748568424bd74e7390858ad588408253eb))

### Features

- add new theme prop ([cfb397f](https://github.com/vime-js/vime/commit/cfb397f5348f721d285b2f8125a6e0ee954448d8))
- export findRootPlayer utility ([f4ccab1](https://github.com/vime-js/vime/commit/f4ccab104a5ab845b71f51a5ae5fa9b095d7cb5e))
- improve all framework integrations ([0ef1716](https://github.com/vime-js/vime/commit/0ef171655e8f02c277e0f00e90d87fdba8f74bb4))
- new svelte store option ([ce78e15](https://github.com/vime-js/vime/commit/ce78e1532da638fffacdf6988ec66c9390c31f5d))
- **core:** export player event enum ([0918d3f](https://github.com/vime-js/vime/commit/0918d3f2915612584af6496a1df68ee1b554b582))
- new mounted + destroyed props ([e315a5e](https://github.com/vime-js/vime/commit/e315a5e75ce3cfbe28ed81fc2eec05318d9c0e29))

## [1.8.1](https://github.com/vime-js/vime/compare/@vime/core@1.8.0...@vime/core@1.8.1) (2020-08-23)

### Bug Fixes

- **core:** video bg looks off in fullscreen ([95c60c6](https://github.com/vime-js/vime/commit/95c60c68d5b27ad9b1601bf65fd038f84652a7ec))

# [1.8.0](https://github.com/vime-js/vime/compare/@vime/core@1.7.0...@vime/core@1.8.0) (2020-08-23)

### Features

- you can now build custom ui components + new react hooks ([0cde356](https://github.com/vime-js/vime/commit/0cde3563f868eeb405bbb17be8138b2044d55f3d))

# [1.7.0](https://github.com/vime-js/vime/compare/@vime/core@1.6.0...@vime/core@1.7.0) (2020-08-19)

### Features

- allow passing params to embed as query string ([3301f89](https://github.com/vime-js/vime/commit/3301f89489f462a5ea45ff5e2a2eb633cc4fea67))
- **core:** create themes dir and split default/light themes ([fd97368](https://github.com/vime-js/vime/commit/fd97368afd3fed4726352fd31ce733bc7f5b8e4d))

# [1.6.0](https://github.com/vime-js/vime/compare/@vime/core@1.5.0...@vime/core@1.6.0) (2020-08-17)

### Bug Fixes

- **core:** performance improvements to applying state changes ([c0a483a](https://github.com/vime-js/vime/commit/c0a483ae3a6d03878874b9b9fc405a794af1d14e))
- all event names should be prefixed with v ([3bf4742](https://github.com/vime-js/vime/commit/3bf4742ff89f04d5664f341da8acb021ee279eca))

### Features

- **core:** @stencil/core@2.0.0-3 ([09557d1](https://github.com/vime-js/vime/commit/09557d15ef9cc4a8a012e1104381f04b4a34848e))

# [1.5.0](https://github.com/vime-js/vime/compare/@vime/core@1.4.0...@vime/core@1.5.0) (2020-08-15)

### Bug Fixes

- **core/ui/time:** time not aligned correctly ([35dbae9](https://github.com/vime-js/vime/commit/35dbae97f10eeeced67fbcbdd3f3c9074616dba5))

### Features

- add media package ([9ed3687](https://github.com/vime-js/vime/commit/9ed3687dedb7d53d7bd5efe03b8d27be64058536))

# [1.4.0](https://github.com/vime-js/vime/compare/@vime/core@1.3.0...@vime/core@1.4.0) (2020-08-15)

### Bug Fixes

- **core:** remove invalid unpkg/jsdelivr keys ([b0c857a](https://github.com/vime-js/vime/commit/b0c857a15305c19687152f6eb6d71ea17b047c07))

### Features

- @stencil/core@2.0.0-2 ([1c175dc](https://github.com/vime-js/vime/commit/1c175dce1d9ef203664f9b513af40541758b3f08))

# [1.3.0](https://github.com/vime-js/vime/compare/@vime/core@1.2.0...@vime/core@1.3.0) (2020-08-14)

### Features

- **angular:** create angular bindings/package ([ed03bb0](https://github.com/vime-js/vime/commit/ed03bb0a33277f4babba7e4671b491a8f1fc71e3))

# [1.2.0](https://github.com/vime-js/vime/compare/@vime/core@1.1.0...@vime/core@1.2.0) (2020-08-14)

### Features

- **vue:** create vue bindings/package ([f162808](https://github.com/vime-js/vime/commit/f1628087df85b02a73a22e9813cacb64b7848b37))

# [1.1.0](https://github.com/vime-js/vime/compare/@vime/core@1.0.2...@vime/core@1.1.0) (2020-08-13)

### Features

- **react:** add react bindings for vime ([8f1543b](https://github.com/vime-js/vime/commit/8f1543b7309d0cd96e45afd7f7abd5b20d2597d0))

## [1.0.2](https://github.com/vime-js/vime/compare/@vime/core@1.0.1...@vime/core@1.0.2) (2020-08-13)

### Bug Fixes

- **core:** point unpkg and jsdelivr to correct file ([8360ad6](https://github.com/vime-js/vime/commit/8360ad62197ab35a3f51986f83e9412c7fd11a3b))

## [1.0.1](https://github.com/vime-js/vime/compare/@vime/core@1.0.0...@vime/core@1.0.1) (2020-08-13)

### Bug Fixes

- **core:** icons not loading ([2b48c85](https://github.com/vime-js/vime/commit/2b48c8547b0b7454b48a2c2707e82d74837ae9cb))

# 1.0.0 (2020-08-12)

### Bug Fixes

- **core:** lazy loading broken ([792520a](https://github.com/vime-js/vime/commit/792520ac17dcd8d70179ac4b29d91d4ac5a127eb))
- **core:** prevent posters loading twice with custom UI ([5aefb06](https://github.com/vime-js/vime/commit/5aefb06f3ad7e80204ce4966f42d5372a3517a70))
- **core/ui:** slider keydown events propagating ([94fafe1](https://github.com/vime-js/vime/commit/94fafe1f485e841febea3dd8a065588bf874622a))
- **core/ui/captions:** emitting events after disconnecting ([5f0abac](https://github.com/vime-js/vime/commit/5f0abac07f6b497607968265435e76a248ba3edf))
- **core/ui/captions:** toggling captions on/off broken ([090d776](https://github.com/vime-js/vime/commit/090d7762401750d91f9a1cc12a320cbfa3652eb6))

### Features

- **core:** add lazy loading via lozad ([3bde06c](https://github.com/vime-js/vime/commit/3bde06c5928895195f8e934c6808eca964737d07))
- **core:** add skeleton loading animation ([ff7860d](https://github.com/vime-js/vime/commit/ff7860ddfe74f029c3d365870a31d6d3d72f2748))
- **core:** dailymotion + hls + dash providers ([c520c30](https://github.com/vime-js/vime/commit/c520c302e5db91f20c9944915a43102ff1305e51))
- **core:** improve test harness + vimeo provider ([dd153ca](https://github.com/vime-js/vime/commit/dd153ca96026a3ef80c89fa1dcc560e36dcc7c1d))
- **core:** vime-embed component ([b45be6f](https://github.com/vime-js/vime/commit/b45be6f642e286b7da568b4450e8268334961019))
- **core:** vime-player component ([c86bee4](https://github.com/vime-js/vime/commit/c86bee4f709fd51d6457805df6c6c19efa0abc89))
- **core:** youtube provider + providers test harness ([8f93a68](https://github.com/vime-js/vime/commit/8f93a68edd16d4396c708e84e8e5bc1d8da69c41))
- **core/ui:** add click-to-play component ([fcce4f1](https://github.com/vime-js/vime/commit/fcce4f11b32f4603f96677dd10803233c344e8d8))
- **core/ui:** add light audio player theme ([93d4206](https://github.com/vime-js/vime/commit/93d42062ee2515ac37a10244961767714cfa87f9))
- **core/ui:** captions component ([c810f42](https://github.com/vime-js/vime/commit/c810f42d00cc81aa3cf35bf81baf2846dcbba4bb))
- **core/ui:** controls components ([5dc4e26](https://github.com/vime-js/vime/commit/5dc4e261e23df6993694abfa776af8637fb7b9a6))
- **core/ui:** create settings components ([3a1fd82](https://github.com/vime-js/vime/commit/3a1fd82a232b67f27759dc94e1e76fea8228f97e))
- **core/ui:** icons + icon component ([d13df8e](https://github.com/vime-js/vime/commit/d13df8ef1b265ec995b8a37f023162f7a978da37))
- **core/ui:** poster + spinner components ([cbdd69f](https://github.com/vime-js/vime/commit/cbdd69ff9f3474639f2a781809859c3b94beb7ff))
- **core/ui:** scrim component ([df47efe](https://github.com/vime-js/vime/commit/df47efe31b3088157896120b9f7ff2d78bdd5c99))
- **core/ui/controls:** add option to scale control size up/down ([3635b1a](https://github.com/vime-js/vime/commit/3635b1ae0d2d2d0163086a01d4e1f6fb2468a561))
- **core/ui/poster:** add poster events ([9d36f47](https://github.com/vime-js/vime/commit/9d36f47a55f6459e8ffc24018cf2fb5c2654fcde))
- **core/ui/scrim:** add events ([1180240](https://github.com/vime-js/vime/commit/1180240c8e93cce96009c3c2098064806dfa4c37))
- **core/ui/scrim:** add gradient option ([adf6bcb](https://github.com/vime-js/vime/commit/adf6bcbdb2d8520552bb6c93b5bc1f30ab95ce84))
- **core/ui/settings:** add audio/mobile styles to settings ([c937312](https://github.com/vime-js/vime/commit/c937312b344e2a5b3bb10315367f98c6b0eb81a0))
- **core/ui/spinner:** add events ([13dfd14](https://github.com/vime-js/vime/commit/13dfd1445d72357a1ed315cd3a25e955be19a772))
