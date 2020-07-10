# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.4](https://github.com/vime-js/vime/compare/v1.6.3...v1.6.4) (2020-07-10)


### Bug Fixes

* vimeo current time not updating after seeking ([3af6e08](https://github.com/vime-js/vime/commit/3af6e08900730fb06be889441368373aaf800260)), closes [#53](https://github.com/vime-js/vime/issues/53)
* window leakage breaking SSR ([6373b0a](https://github.com/vime-js/vime/commit/6373b0af64fc55748888806e9002711e2ea9f102)), closes [#55](https://github.com/vime-js/vime/issues/55)





## [1.6.3](https://github.com/vime-js/vime/compare/v1.6.2...v1.6.3) (2020-05-24)


### Bug Fixes

* **complete:** media not visible on safari fullscreen ([3efc72d](https://github.com/vime-js/vime/commit/3efc72d8e383e1e84061a35ce6a17c87ba244308)), closes [#43](https://github.com/vime-js/vime/issues/43)





## [1.6.2](https://github.com/vime-js/vime/compare/v1.6.1...v1.6.2) (2020-05-03)


### Bug Fixes

* **preview:** poster not displaying ([8f1c901](https://github.com/vime-js/vime/commit/8f1c9012af34163313c7779f229b7a56fd9b998f))





## [1.6.1](https://github.com/vime-js/vime/compare/v1.6.0...v1.6.1) (2020-05-02)


### Bug Fixes

* file provider not setting video quality ([e2cbb8b](https://github.com/vime-js/vime/commit/e2cbb8b5f6457151eebab08e2e8bdcecaa792087))
* ssr support ([f157485](https://github.com/vime-js/vime/commit/f157485266a047e738edbc5fb24576bc52fad52a)), closes [#38](https://github.com/vime-js/vime/issues/38)
* **playground:** subtitles missing for hls and dash ([967ed1b](https://github.com/vime-js/vime/commit/967ed1b057e14c382b347e1987893fa1c8fbc38b))





# [1.6.0](https://github.com/mihar-22/vime/compare/v1.5.1...v1.6.0) (2020-04-26)


### Features

* replace unpkg with jsdelivr for faster loads ([a80398f](https://github.com/mihar-22/vime/commit/a80398ff6dc45ba28d88566585b73c57eedd7d82))





## [1.5.1](https://github.com/mihar-22/vime/compare/v1.5.0...v1.5.1) (2020-04-26)


### Bug Fixes

* **standard:** audio player not visible ([00f2c90](https://github.com/mihar-22/vime/commit/00f2c90219c9f7d1923235184923df1addc4d8e1))
* **standard:** recommended quality by the filerprovider is too low ([69bf62d](https://github.com/mihar-22/vime/commit/69bf62dbcafa169c0b6d5f88cd25229d422b1dda)), closes [#33](https://github.com/mihar-22/vime/issues/33)
* vimeo controls are not being hidden ([3690633](https://github.com/mihar-22/vime/commit/36906336f94aebe31a97fcfa860036f2bf5525da)), closes [#32](https://github.com/mihar-22/vime/issues/32)
* **lite:** vimeo embed is not responsive ([d74b846](https://github.com/mihar-22/vime/commit/d74b846ca80d783152446612ccabf8dbe48c9aad)), closes [#31](https://github.com/mihar-22/vime/issues/31)





# [1.5.0](https://github.com/mihar-22/vime/compare/v1.4.4...v1.5.0) (2020-04-12)


### Bug Fixes

* **complete:** controls have poor visibility on light background ([4b276d5](https://github.com/mihar-22/vime/commit/4b276d5b1d99dc0b3cc0e38db583ceb7c8ae274d))
* **complete:** delay poster fading out to avoid flashes ([7704d78](https://github.com/mihar-22/vime/commit/7704d78a54f354c633f57186f5f17c3342aa8141))
* **complete:** hide captions control if there are no tracks ([bbaca4c](https://github.com/mihar-22/vime/commit/bbaca4c5355d81c10143021fb322591aaea29a09))
* **complete:** hls + dash should update media type on mount ([12e1a1a](https://github.com/mihar-22/vime/commit/12e1a1a44bc250c49c975520b6f43f8560c4af65))
* **complete:** increase clickable target of scrubber ([1340fc8](https://github.com/mihar-22/vime/commit/1340fc8fff7279f465b26576041bc6fc20ce39fb)), closes [#3](https://github.com/mihar-22/vime/issues/3)
* **complete:** languages store typo ([ecfc601](https://github.com/mihar-22/vime/commit/ecfc6018997fde37aa87eb2ee2e7ebb1c8ddfabd))
* **complete:** loading hls library error not caught ([58c39af](https://github.com/mihar-22/vime/commit/58c39af992fabe52cdcd68029b520f9397b90a35))
* **complete:** settings should display none when there are no captions ([c5d6b6a](https://github.com/mihar-22/vime/commit/c5d6b6abc736a23b0a5666b68c35cd28296c2617))
* **playground:** hls src should be loaded with https ([1ba597f](https://github.com/mihar-22/vime/commit/1ba597f4cd06d2079e1cdf54f2ae43b4b5df9fbd))
* **playground:** use https files for dash demos ([c1685b7](https://github.com/mihar-22/vime/commit/c1685b7a425f4352f3eaad4178a4b91d8c94f953))


### Features

* dash support ([0b18a89](https://github.com/mihar-22/vime/commit/0b18a89c17e66a70b838f7c6aa548dd6ae3462fc)), closes [#8](https://github.com/mihar-22/vime/issues/8)
* hls support ([a7e6a44](https://github.com/mihar-22/vime/commit/a7e6a448f70a98858df3fee5cd92e7b5736da7da))





## [1.4.4](https://github.com/vime-js/vime/compare/v1.4.3...v1.4.4) (2020-04-10)


### Bug Fixes

* **standard:** current player not set correctly ([daf51b7](https://github.com/vime-js/vime/commit/daf51b7123a1579cfc40e8513203bcd8dad22eb8))





## [1.4.3](https://github.com/vime-js/vime/compare/v1.4.2...v1.4.3) (2020-04-10)


### Bug Fixes

* **standard:** player not becoming active ([89ab81c](https://github.com/vime-js/vime/commit/89ab81ce40b9e260086d122e3f05623b69e9bc7a))





## [1.4.2](https://github.com/vime-js/vime/compare/v1.4.1...v1.4.2) (2020-04-10)


### Bug Fixes

* rename srcId to mediaId ([6dcaf41](https://github.com/vime-js/vime/commit/6dcaf41d5ae64ca83f3859f19634a45a24ce84ce))





## [1.4.1](https://github.com/vime-js/vime/compare/v1.4.0...v1.4.1) (2020-04-09)


### Bug Fixes

* **complete:** player not lazy loading correctly ([d729d44](https://github.com/vime-js/vime/commit/d729d4457950070ed7913b4af475e9815089c019))





# [1.4.0](https://github.com/vime-js/vime/compare/v1.3.0...v1.4.0) (2020-04-09)


### Bug Fixes

* **complete:** controls hiding whilst settings is open ([f3fed0c](https://github.com/vime-js/vime/commit/f3fed0cd039038acf1f55406613f61c2afb52c8a))
* **complete:** dailymotion qualities not loading ([443edd6](https://github.com/vime-js/vime/commit/443edd6172440c53acec547e3aaec75e80469c04))
* **complete:** set menu item radio defaults to null ([ab22a09](https://github.com/vime-js/vime/commit/ab22a090208b328e1d535ab00356f3328ceab945))
* **complete:** toggling between native/custom controls broken ([05d0cbd](https://github.com/vime-js/vime/commit/05d0cbd055924caf605749e18f3cf8a00020d752))
* **complete:** tweak poster img alt text ([6eeac87](https://github.com/vime-js/vime/commit/6eeac874204ecd7dc74f12a15fff61d46f6ff485))
* **playground:** increase interactives width for larger screens ([e71a696](https://github.com/vime-js/vime/commit/e71a696ffe983bbebc7e50d33973aaa592cad1de))
* **playground:** remove focus ring on audio and video players ([f8389bd](https://github.com/vime-js/vime/commit/f8389bd62ef74d07d4e7320d1040a86bf7ed3617))
* **standard:** dailymotion duration not loading ([acf77f2](https://github.com/vime-js/vime/commit/acf77f21b2c4ac620719266e02a9b4acc8b4a154))
* **standard:** fullscreen detection not working ([5a1784a](https://github.com/vime-js/vime/commit/5a1784a89c533b3b374819b44f3c009109d13123))
* **standard:** load native poster when using native controls ([dfab438](https://github.com/vime-js/vime/commit/dfab43851a910838173ad49896a43da4b0e5b0c2))
* **standard:** providers missing getEl function ([f1b20b4](https://github.com/vime-js/vime/commit/f1b20b40cc0015aa3b4016ee9d13ec91bd53f2df))
* **standard:** safely exit pip and fullscreen ([21393bf](https://github.com/vime-js/vime/commit/21393bf710a1607ebe2d1d2d25f1e0f86ba5a765))


### Features

* **complete:** play request interrupts starting dm ad ([2519ef5](https://github.com/vime-js/vime/commit/2519ef5400b91ff2d3bc7935841eda0bf3508f91))
* **complete:** start with big playback control for vids on desktop ([38ced8a](https://github.com/vime-js/vime/commit/38ced8a6ba7e81ccdb5339b2787e4342c44f5c7d))
* **preview:** tweaked design of play icon and it can now be scaled ([03133fa](https://github.com/vime-js/vime/commit/03133fa37dfb63d10000c90f0a331a1a240a1166))





# [1.3.0](https://github.com/vime-js/vime/compare/v1.2.0...v1.3.0) (2020-04-09)


### Bug Fixes

* **core:** unknown video quality should be an integer ([30506ac](https://github.com/vime-js/vime/commit/30506ac408bf78f61e6f398e82703b6dbc87b3e1))
* **player:** hide video quality and captions settings on audio player ([a77355a](https://github.com/vime-js/vime/commit/a77355a9e125ce3804bbc48fc4d43bbe719d21ff))
* **playground:** tick call delaying event listener ([5ca4738](https://github.com/vime-js/vime/commit/5ca47389a10da405ceb7afb4976792747e141946))
* **preview:** improve loading detection and event firing ([9dc470f](https://github.com/vime-js/vime/commit/9dc470fd56f7ca1f981b5d01064a24847beb2c0b))


### Features

* refactor packages from providers to players ([7ff7504](https://github.com/vime-js/vime/commit/7ff75045788b267688f4cb7f970ce9bb3426036a))
