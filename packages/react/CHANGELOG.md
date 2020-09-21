# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.1](https://github.com/vime-js/vime/compare/v4.0.0...v4.0.1) (2020-09-21)

**Note:** Version bump only for package @vime/react





# [4.0.0](https://github.com/vime-js/vime/compare/v3.2.2...v4.0.0) (2020-09-20)

**Note:** Version bump only for package @vime/react





## [3.2.2](https://github.com/vime-js/vime/compare/v3.2.1...v3.2.2) (2020-09-17)


### Bug Fixes

* update vime description ([625f14a](https://github.com/vime-js/vime/commit/625f14ae3d0fbdd830fc6a33d035898da9ee3552))





## [3.2.1](https://github.com/vime-js/vime/compare/v3.2.0...v3.2.1) (2020-09-14)

**Note:** Version bump only for package @vime/react





# [3.2.0](https://github.com/vime-js/vime/compare/v3.1.0...v3.2.0) (2020-09-14)


### Features

* language translation interface ([2f99724](https://github.com/vime-js/vime/commit/2f99724b34b95d33fdc9207533b5e9dc05fdb304))





# [3.1.0](https://github.com/vime-js/vime/compare/v3.0.2...v3.1.0) (2020-09-11)

**Note:** Version bump only for package @vime/react





## [3.0.2](https://github.com/vime-js/vime/compare/v3.0.1...v3.0.2) (2020-09-11)

**Note:** Version bump only for package @vime/react





## [3.0.1](https://github.com/vime-js/vime/compare/v3.0.0...v3.0.1) (2020-09-10)

**Note:** Version bump only for package @vime/react





# 3.0.0 (2020-09-10)


### Bug Fixes

* clean up changelogs ([093bcde](https://github.com/vime-js/vime/commit/093bcdec9baea44d46ec217dcdc51c4236eb255b))
* cleanup internals and integrations ([5e21c3b](https://github.com/vime-js/vime/commit/5e21c3b936e7e81fcfd60bb8b14e8f185b701039))
* include auto-gen code for libraries in git ([8bb7cf4](https://github.com/vime-js/vime/commit/8bb7cf4f655f67d2c5838a4f0c1ffb4390eaa8f2))
* packages should use @vime/core@^2 ([9703777](https://github.com/vime-js/vime/commit/9703777d9f1d6dec8f6db7ffb4010f96b0a7d421))


### Features

* export loadSprite helper ([173e6dd](https://github.com/vime-js/vime/commit/173e6ddd1b517233bd46bc94e6bda891f4a1e403))
* **svelte:** all new svelte bindings ([acfb943](https://github.com/vime-js/vime/commit/acfb943d12ebabe176dbd5785ea0a3a2b39cc758))
* export findRootPlayer utility ([f62de47](https://github.com/vime-js/vime/commit/f62de47046f4a7e0649a93c68aeef01e32c950e4))
* improve all framework integrations ([3eb4de7](https://github.com/vime-js/vime/commit/3eb4de767c803e3631e7304d2266b9276ec2ecdc))
* new svelte store option ([e49f6f8](https://github.com/vime-js/vime/commit/e49f6f8e1e7e3fd3d521116fc20f641d8a233d6a))
* **angular:** create angular bindings/package ([edd1e20](https://github.com/vime-js/vime/commit/edd1e20acb17af8ba5e5f63ea7e33715d1ba96af))
* **core:** create themes dir and split default/light themes ([37a5df5](https://github.com/vime-js/vime/commit/37a5df5f63823d3d16ec9d791fc8c7f9ecd96017))
* **react:** export player event enum ([e09eba6](https://github.com/vime-js/vime/commit/e09eba664b0c2801a3318236836225ba70d5fc7e))
* you can now build custom ui components + new react hooks ([b4f7b51](https://github.com/vime-js/vime/commit/b4f7b519901874a6ba59c53d504adacf32259fa1))
* **react:** add react bindings for vime ([8ec4a11](https://github.com/vime-js/vime/commit/8ec4a119fce27e4b7e3f26e7c00d771064c467b9))
* **vue:** create vue bindings/package ([c034fe5](https://github.com/vime-js/vime/commit/c034fe59bba3b62ab2c919757ee7fb53c93b8a74))


### BREAKING CHANGES

* export changes listed below.

- `PlayerProp` is now a type (union of strings) and not enum.
- `PlayerEvent` is now a type (union of strings) and not enum.
- `useInternalPlayerContext` has been removed from `@vime/react`.
- `useInternalPlayerStore` has been removed from `@vime/svelte`.
- Providers dispatch changes in a separate event (`vProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.
