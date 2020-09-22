# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.2](https://github.com/vime-js/vime/compare/v4.0.1...v4.0.2) (2020-09-22)

**Note:** Version bump only for package @vime/svelte





## [4.0.1](https://github.com/vime-js/vime/compare/v4.0.0...v4.0.1) (2020-09-21)

**Note:** Version bump only for package @vime/svelte





# [4.0.0](https://github.com/vime-js/vime/compare/v3.2.2...v4.0.0) (2020-09-20)

**Note:** Version bump only for package @vime/svelte





## [3.2.2](https://github.com/vime-js/vime/compare/v3.2.1...v3.2.2) (2020-09-17)


### Bug Fixes

* update vime description ([625f14a](https://github.com/vime-js/vime/commit/625f14ae3d0fbdd830fc6a33d035898da9ee3552))





## [3.2.1](https://github.com/vime-js/vime/compare/v3.2.0...v3.2.1) (2020-09-14)

**Note:** Version bump only for package @vime/svelte





# [3.2.0](https://github.com/vime-js/vime/compare/v3.1.0...v3.2.0) (2020-09-14)

**Note:** Version bump only for package @vime/svelte





# [3.1.0](https://github.com/vime-js/vime/compare/v3.0.2...v3.1.0) (2020-09-11)

**Note:** Version bump only for package @vime/svelte





## [3.0.2](https://github.com/vime-js/vime/compare/v3.0.1...v3.0.2) (2020-09-11)

**Note:** Version bump only for package @vime/svelte





## [3.0.1](https://github.com/vime-js/vime/compare/v3.0.0...v3.0.1) (2020-09-10)

**Note:** Version bump only for package @vime/svelte





# 3.0.0 (2020-09-10)


### Bug Fixes

* **svelte:** should import player store from dist ([6edd51b](https://github.com/vime-js/vime/commit/6edd51b43f0c5a4bbe7ca305b78237a082b96453))
* clean up changelogs ([093bcde](https://github.com/vime-js/vime/commit/093bcdec9baea44d46ec217dcdc51c4236eb255b))
* cleanup internals and integrations ([5e21c3b](https://github.com/vime-js/vime/commit/5e21c3b936e7e81fcfd60bb8b14e8f185b701039))
* include auto-gen code for libraries in git ([8bb7cf4](https://github.com/vime-js/vime/commit/8bb7cf4f655f67d2c5838a4f0c1ffb4390eaa8f2))
* packages should use @vime/core@^2 ([9703777](https://github.com/vime-js/vime/commit/9703777d9f1d6dec8f6db7ffb4010f96b0a7d421))
* type error thrown when ui root not found ([b638607](https://github.com/vime-js/vime/commit/b6386077a0266d7ecb6b5049271b45a69cc67f83))
* **core/default-controls:** no scrim on desktop video when using light theme ([1ee8dc0](https://github.com/vime-js/vime/commit/1ee8dc03990a6ec9750d3f46eedb863c1e14ac8a))


### Features

* simplify control/icon styling ([7b9aaf6](https://github.com/vime-js/vime/commit/7b9aaf68890b560aad31f6b941082e46f9700930))
* skeleton loading animation ([5afb198](https://github.com/vime-js/vime/commit/5afb19856a8d918200df7a334593b29800358485))
* **providers/file:** watch source elements for changes and call load ([a4e0165](https://github.com/vime-js/vime/commit/a4e0165ee7b323e75694ae44eb52237eb4331c86))
* **svelte:** all new svelte bindings ([acfb943](https://github.com/vime-js/vime/commit/acfb943d12ebabe176dbd5785ea0a3a2b39cc758))
* **svelte:** new usePlayer helper ([f19823b](https://github.com/vime-js/vime/commit/f19823b80b6d3c2dadfd9ad7ba64ea7826fee0d7))
* improve all framework integrations ([3eb4de7](https://github.com/vime-js/vime/commit/3eb4de767c803e3631e7304d2266b9276ec2ecdc))
* new svelte store option ([e49f6f8](https://github.com/vime-js/vime/commit/e49f6f8e1e7e3fd3d521116fc20f641d8a233d6a))


### BREAKING CHANGES

* export changes listed below.

- `PlayerProp` is now a type (union of strings) and not enum.
- `PlayerEvent` is now a type (union of strings) and not enum.
- `useInternalPlayerContext` has been removed from `@vime/react`.
- `useInternalPlayerStore` has been removed from `@vime/svelte`.
- Providers dispatch changes in a separate event (`vProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.
