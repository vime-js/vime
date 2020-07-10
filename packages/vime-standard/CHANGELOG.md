# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.4](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.6.3...v1.6.4) (2020-07-10)


### Bug Fixes

* vimeo current time not updating after seeking ([3af6e08](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/3af6e08900730fb06be889441368373aaf800260)), closes [#53](https://github.com/vime-js/vime/tree/master/packages/vime-standard/issues/53)





## [1.6.1](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.6.0...v1.6.1) (2020-05-02)


### Bug Fixes

* file provider not setting video quality ([e2cbb8b](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/e2cbb8b5f6457151eebab08e2e8bdcecaa792087))
* ssr support ([f157485](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/f157485266a047e738edbc5fb24576bc52fad52a)), closes [#38](https://github.com/vime-js/vime/tree/master/packages/vime-standard/issues/38)





# [1.6.0](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.5.1...v1.6.0) (2020-04-26)


### Features

* replace unpkg with jsdelivr for faster loads ([a80398f](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/a80398ff6dc45ba28d88566585b73c57eedd7d82))





## [1.5.1](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.5.0...v1.5.1) (2020-04-26)


### Bug Fixes

* **standard:** recommended quality by the filerprovider is too low ([69bf62d](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/69bf62dbcafa169c0b6d5f88cd25229d422b1dda)), closes [#33](https://github.com/vime-js/vime/tree/master/packages/vime-standard/issues/33)
* vimeo controls are not being hidden ([3690633](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/36906336f94aebe31a97fcfa860036f2bf5525da)), closes [#32](https://github.com/vime-js/vime/tree/master/packages/vime-standard/issues/32)





# [1.5.0](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.4.4...v1.5.0) (2020-04-12)


### Bug Fixes

* **complete:** hls + dash should update media type on mount ([12e1a1a](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/12e1a1a44bc250c49c975520b6f43f8560c4af65))
* **complete:** loading hls library error not caught ([58c39af](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/58c39af992fabe52cdcd68029b520f9397b90a35))


### Features

* dash support ([0b18a89](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/0b18a89c17e66a70b838f7c6aa548dd6ae3462fc)), closes [#8](https://github.com/vime-js/vime/tree/master/packages/vime-standard/issues/8)
* hls support ([a7e6a44](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/a7e6a448f70a98858df3fee5cd92e7b5736da7da))





## [1.4.4](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.4.3...v1.4.4) (2020-04-10)


### Bug Fixes

* **standard:** current player not set correctly ([daf51b7](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/daf51b7123a1579cfc40e8513203bcd8dad22eb8))





## [1.4.3](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.4.2...v1.4.3) (2020-04-10)


### Bug Fixes

* **standard:** player not becoming active ([89ab81c](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/89ab81ce40b9e260086d122e3f05623b69e9bc7a))





## [1.4.2](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.4.1...v1.4.2) (2020-04-10)


### Bug Fixes

* rename srcId to mediaId ([6dcaf41](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/6dcaf41d5ae64ca83f3859f19634a45a24ce84ce))





## [1.4.1](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.4.0...v1.4.1) (2020-04-09)


### Bug Fixes

* **complete:** player not lazy loading correctly ([d729d44](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/d729d4457950070ed7913b4af475e9815089c019))





# [1.4.0](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.3.0...v1.4.0) (2020-04-09)


### Bug Fixes

* **complete:** dailymotion qualities not loading ([443edd6](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/443edd6172440c53acec547e3aaec75e80469c04))
* **standard:** dailymotion duration not loading ([acf77f2](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/acf77f21b2c4ac620719266e02a9b4acc8b4a154))
* **standard:** fullscreen detection not working ([5a1784a](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/5a1784a89c533b3b374819b44f3c009109d13123))
* **standard:** load native poster when using native controls ([dfab438](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/dfab43851a910838173ad49896a43da4b0e5b0c2))
* **standard:** providers missing getEl function ([f1b20b4](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/f1b20b40cc0015aa3b4016ee9d13ec91bd53f2df))
* **standard:** safely exit pip and fullscreen ([21393bf](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/21393bf710a1607ebe2d1d2d25f1e0f86ba5a765))


### Features

* **complete:** play request interrupts starting dm ad ([2519ef5](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/2519ef5400b91ff2d3bc7935841eda0bf3508f91))





# [1.3.0](https://github.com/vime-js/vime/tree/master/packages/vime-standard/compare/v1.2.0...v1.3.0) (2020-04-09)


### Features

* refactor packages from providers to players ([7ff7504](https://github.com/vime-js/vime/tree/master/packages/vime-standard/commit/7ff75045788b267688f4cb7f970ce9bb3426036a))
