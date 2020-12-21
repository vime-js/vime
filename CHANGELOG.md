# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 5.0.16 (2020-12-21)


### Bug Fixes

* **angular:** add for support angular 9/10 ([1d251f1](https://github.com/vime-js/vime/commit/1d251f1efb25f2f4879b849a15e73289393b1393)), closes [#124](https://github.com/vime-js/vime/issues/124)





## 5.0.15 (2020-12-21)

**Note:** Version bump only for package vime





## 5.0.14 (2020-12-21)


### Bug Fixes

* **angular:** not working in production ([d7d42a4](https://github.com/vime-js/vime/commit/d7d42a46eb1373b22b2c9ab3abd0f3ab40a26ef5)), closes [#124](https://github.com/vime-js/vime/issues/124)





## 5.0.13 (2020-12-20)

**Note:** Version bump only for package vime





## 5.0.12 (2020-12-20)

### Bug Fixes

* hls/dash provider connection not being established ([70b5e055](https://github.com/vime-js/vime/commit/70b5e055eab8aef28a9804fd3d49ca8e2ddf6a06))
* handle youtube falling back to an unstarted state after loading ([a6c3923b](https://github.com/vime-js/vime/commit/a6c3923b4d3dbf5073eeebab586301eeb530f7d1))



## 5.0.11 (2020-12-20)

### Bug Fixes

* youtube widget referrer parameter causes CORS issues ([1b6f0235](https://github.com/vime-js/vime/commit/1b6f0235fb96b02bedab5fc80cf3cf7909bf24aa))
* vimeo not hiding controls ([24a21223](https://github.com/vime-js/vime/commit/24a212236272678592017db4b64ab6ff258be2b6))




## 5.0.10 (2020-12-20)


### Bug Fixes

* avoid accidentally rendering two iframes ([a880a4e](https://github.com/vime-js/vime/commit/a880a4e36b6562b3044e7b24db399599e1fab8d9))
* embedded media (youtube/vimeo/dailymotion) not updating view type ([ef660a4](https://github.com/vime-js/vime/commit/ef660a4402a3f4d9494c96cd297e7902062f16da))



## 5.0.9 (2020-12-20)


### Bug Fixes

* file provider not setting current time when updated ([98890b9](https://github.com/vime-js/vime/commit/98890b966cac1b638c68011e028dab6c60f079f7))





## 5.0.8 (2020-12-18)


### Bug Fixes

* embed component should not load undefined `embedSrc` ([4ff11ae](https://github.com/vime-js/vime/commit/4ff11aefd68fcacdfc0a2cfecf833de9cc44f9ad))





## 5.0.7 (2020-12-18)


### Bug Fixes

* dont attempt to load youtube/dailymotion/vimeo video if `videoId` is undefined ([5acb6c7](https://github.com/vime-js/vime/commit/5acb6c7c38382010a67efc3c6f3c47010e2f6d87))





## 5.0.6 (2020-12-18)


### Bug Fixes

* **angular:** unpack dist into root package ([6be7076](https://github.com/vime-js/vime/commit/6be70767a15b8a508a949f5d916633c9574db1e7))





## 5.0.5 (2020-12-17)


### Bug Fixes

* duplicate settings in default ui ([150a8e0](https://github.com/vime-js/vime/commit/150a8e07c4eb7dbfbb9bab3195b5cc1201605c94))





## 5.0.4 (2020-12-17)

**Note:** Version bump only for package vime





## 5.0.3 (2020-12-17)


### Bug Fixes

* adapter calls throw if called too early ([a57d68c](https://github.com/vime-js/vime/commit/a57d68c95bbad27af090f207deaa864bb2c53431))





## 5.0.2 (2020-12-17)


### Bug Fixes

* **react:** split dom/wc props ([f906522](https://github.com/vime-js/vime/commit/f9065226aaff6afd1da2d3a439b3bf8d75f1e459))





## 5.0.1 (2020-12-17)


### Bug Fixes

* **react:** pass className and style to render function ([45136c1](https://github.com/vime-js/vime/commit/45136c1dab4359590f4f43dd3b17d536ba133fb2))





# 5.0.0 (2020-12-17)


### Features

* v5 ([933347b](https://github.com/vime-js/vime/commit/933347b5fd2a38b74ef6e3f7d6a779c4b0f0d0c3))


### BREAKING CHANGES

* see #126 for a breakdown on what's new/changed.





## [4.7.3](https://github.com/vime-js/vime/compare/v4.7.2...v4.7.3) (2020-11-17)


### Bug Fixes

* re-attempt initiating playback when autoplay is `true` ([35fe5f0](https://github.com/vime-js/vime/commit/35fe5f024c52ed27c8c184f7884760c4ea3a9a69))





## [4.7.2](https://github.com/vime-js/vime/compare/v4.7.1...v4.7.2) (2020-11-17)

**Note:** Version bump only for package vime





## [4.7.1](https://github.com/vime-js/vime/compare/v4.7.0...v4.7.1) (2020-11-16)


### Bug Fixes

* **providers/hls:** do not load tracks via `<track>` element with hls ([dbde397](https://github.com/vime-js/vime/commit/dbde39700d44180a8ed78cdf8981dfd60a3936cd)), closes [#107](https://github.com/vime-js/vime/issues/107)
* **react:** cache and event handler is shared by multiple instances ([64c76a7](https://github.com/vime-js/vime/commit/64c76a76e43a46045da9a71133f1bee3bb34ca50))
* **react:** event listeners are not called ([6f47539](https://github.com/vime-js/vime/commit/6f475398194c72f674b026e45a29cfad6ce5d854))





# [4.7.0](https://github.com/vime-js/vime/compare/v4.6.0...v4.7.0) (2020-11-16)


### Bug Fixes

* **core:** stop listening to intersection observer after intersecting ([cd480a9](https://github.com/vime-js/vime/commit/cd480a9fc3e273fdee21925011a83631eb6472c7))
* vimeo and youtube not firing playback ready when autoplay is `true` ([e083a92](https://github.com/vime-js/vime/commit/e083a9240d3a386b5485976df7b1bf1bf29e58f5)), closes [#111](https://github.com/vime-js/vime/issues/111)
* **svelte:** could not resolve lib file ([2c4c850](https://github.com/vime-js/vime/commit/2c4c850969d7beb920be7790f1d8a56387611cd6)), closes [#110](https://github.com/vime-js/vime/issues/110)
* vue components not reactive ([a6a24eb](https://github.com/vime-js/vime/commit/a6a24eb139622685f27eb20b6a9b47004019472c)), closes [#108](https://github.com/vime-js/vime/issues/108)


### Features

* **angular:** you can now use `@vime/angular` instead of `@vime/angular/dist` ([bc110f8](https://github.com/vime-js/vime/commit/bc110f82a54a986922ded06cd2b2f0d033a60f07))





# [4.6.0](https://github.com/vime-js/vime/compare/v4.5.0...v4.6.0) (2020-11-10)


### Bug Fixes

* **ui/settings:** root settings menu dissapears during exit transition ([97dc4f9](https://github.com/vime-js/vime/commit/97dc4f9691232df822402062363115c07600f463))


### Features

* **providers/file:** allow multiple static file qualities to be used ([589f05b](https://github.com/vime-js/vime/commit/589f05be1cffedda82c775a7cb784223556a4000)), closes [#86](https://github.com/vime-js/vime/issues/86)





# [4.5.0](https://github.com/vime-js/vime/compare/v4.4.0...v4.5.0) (2020-11-10)


### Features

* allow custom posters for youtube, vimeo and dailymotion ([9a89dfa](https://github.com/vime-js/vime/commit/9a89dfaaf388ddd774be98ee0627970cce2d4cb4)), closes [#94](https://github.com/vime-js/vime/issues/94)
* delay poster hiding until playback begins ([61aaa0a](https://github.com/vime-js/vime/commit/61aaa0aa4e7a64eb7b90d6f0e7fff8a9738acf0c))
* smoother opening transition for the settings menu ([298987f](https://github.com/vime-js/vime/commit/298987fffe949ae2b2dca18312796004a717ba74))
* **providers/vimeo:** automatically determine aspect ratio of vimeo videos ([a2d5446](https://github.com/vime-js/vime/commit/a2d5446c3dc5264746c9f243d1a76a4df681cb02)), closes [#99](https://github.com/vime-js/vime/issues/99)





# [4.4.0](https://github.com/vime-js/vime/compare/v4.3.3...v4.4.0) (2020-11-09)


### Bug Fixes

* **core/playground:** bind values to checkboxes ([a2f472e](https://github.com/vime-js/vime/commit/a2f472ebf9114cc4120fd7382ce21d14f2792c5d))
* **providers/vimeo:** volume not updating ([9f168c7](https://github.com/vime-js/vime/commit/9f168c786174b0f85e026de170c974df3d820f6e)), closes [#91](https://github.com/vime-js/vime/issues/91)
* **providers/youtube:** player not paused when video ends and incorrect end time ([b774b39](https://github.com/vime-js/vime/commit/b774b3929521c617d76a5205a688eeb29a8b1e86)), closes [#96](https://github.com/vime-js/vime/issues/96)
* paused/currentTime change before user interaction requires immediate adapter call ([2afb2be](https://github.com/vime-js/vime/commit/2afb2beb8acef7ddf854da0e8b183c62c2673a33)), closes [#100](https://github.com/vime-js/vime/issues/100) [#95](https://github.com/vime-js/vime/issues/95)


### Features

* **providers:** cache any fetched video metadata ([b757f75](https://github.com/vime-js/vime/commit/b757f7584dfc6faf066a5df101c7e36a7d05cfd1))
* allow dynamically changing the current provider ([4a7a43d](https://github.com/vime-js/vime/commit/4a7a43d284e989f468800093662581221419d324))
* new `vime-playground` component for testing and playing with vime ([6ab4ec2](https://github.com/vime-js/vime/commit/6ab4ec2741e0af10eccaffaad8596a9df2e66b05))





## [4.3.3](https://github.com/vime-js/vime/compare/v4.3.2...v4.3.3) (2020-11-06)


### Bug Fixes

* **core:** hls/dash not reconnecting to DOM properly ([426c206](https://github.com/vime-js/vime/commit/426c2064c35ca276133a5b99bcbb04d171c70815))





## [4.3.2](https://github.com/vime-js/vime/compare/v4.3.1...v4.3.2) (2020-11-05)


### Bug Fixes

* add @stencil/core back to deps ([77fb4f6](https://github.com/vime-js/vime/commit/77fb4f6c8533ccbe3f42b09c86aa4893c980f6f4))





## [4.3.1](https://github.com/vime-js/vime/compare/v4.3.0...v4.3.1) (2020-11-04)


### Bug Fixes

* **core:** remove @stencil/core dependency from custom-elements-bundle ([52620af](https://github.com/vime-js/vime/commit/52620af7db567eee0e3cf0b88ecc6361b2dde22f))
* **core:** remove jest types from dist ([833ad05](https://github.com/vime-js/vime/commit/833ad05cf77e7b61c951e74478db140bc2e31044))





# [4.3.0](https://github.com/vime-js/vime/compare/v4.2.0...v4.3.0) (2020-11-04)


### Features

* bundling (rollup/webpack) support and major improvements to treeshaking ([4af48c4](https://github.com/vime-js/vime/commit/4af48c474e61f3355caf23e89d891e10eaeb4f45))
* fresh output targets for all frameworks with treeshaking support + vue 3 bindings, closes [#82](https://github.com/vime-js/vime/issues/82) [#88](https://github.com/vime-js/vime/issues/88) [#71](https://github.com/vime-js/vime/issues/71) [#92](https://github.com/vime-js/vime/issues/92)





# [4.2.0](https://github.com/vime-js/vime/compare/v4.1.3...v4.2.0) (2020-10-02)


### Bug Fixes

* **providers/file:** poster is not loaded on iOS when custom ui is hidden ([eb294cd](https://github.com/vime-js/vime/commit/eb294cd6b96634ddbf30c9166f99245236fbbff2))
* **ui/captions:** add some spacing below captions when controls are hidden ([93193fe](https://github.com/vime-js/vime/commit/93193fe12529c544bdb306666f1df0a832117620))
* **ui/controls:** lower controls not interactable on mobile ([703c07f](https://github.com/vime-js/vime/commit/703c07fbb72507e4f6c73e087c2edebcb077d76d))


### Features

* **ui:** enter landscape mode when entering fullscreen on mobile ([c636d80](https://github.com/vime-js/vime/commit/c636d80ceb412ce5b88c5e34af18282bdd86a195))





## [4.1.3](https://github.com/vime-js/vime/compare/v4.1.2...v4.1.3) (2020-10-01)


### Bug Fixes

* **providers/vimeo:** not centered when aspect ratio is changed ([18769a5](https://github.com/vime-js/vime/commit/18769a56d0fce96bc87e142f0b2c46247ec0f8af)), closes [#77](https://github.com/vime-js/vime/issues/77)
* **providers/vimeo:** toggling muted state not working ([ad38e38](https://github.com/vime-js/vime/commit/ad38e38a5f6a4cf08a21798b0d3f6d6226bd045f))
* **providers/youtube:** hide custom spinner to not overlap with native one ([78d4c5f](https://github.com/vime-js/vime/commit/78d4c5f01169a18ae112a347ceed173d3063cb56))





## [4.1.2](https://github.com/vime-js/vime/compare/v4.1.1...v4.1.2) (2020-09-26)


### Bug Fixes

* cjs exports are broken due to missing `esModuleInterop` typescript flag ([5aea798](https://github.com/vime-js/vime/commit/5aea798a363e4509f203ba231f75b3937afe2d0d)), closes [#68](https://github.com/vime-js/vime/issues/68)





## [4.1.1](https://github.com/vime-js/vime/compare/v4.1.0...v4.1.1) (2020-09-25)


### Bug Fixes

* **svelte:** raw svelte files missing in package ([62f67b0](https://github.com/vime-js/vime/commit/62f67b0de182806774ae9157c6240b16c170a67a))





# [4.1.0](https://github.com/vime-js/vime/compare/v4.0.2...v4.1.0) (2020-09-23)


### Features

* **ui/control:** slightly scale up when focused ([9c34f91](https://github.com/vime-js/vime/commit/9c34f914d2e84ece8273a67f559f1f90eedabc7d))





## [4.0.2](https://github.com/vime-js/vime/compare/v4.0.1...v4.0.2) (2020-09-22)

**Note:** Version bump only for package vime





## [4.0.1](https://github.com/vime-js/vime/compare/v4.0.0...v4.0.1) (2020-09-21)


### Bug Fixes

* **theme:** make skeleton sheen more noticable ([b2cd250](https://github.com/vime-js/vime/commit/b2cd25092daaad6f30a22f18c804dd52333391ae))
* **ui/icons:** handle loading icons inside shadow dom ([e91416e](https://github.com/vime-js/vime/commit/e91416e998045a0b6f5f0d15dca513c33a1be74b))





# [4.0.0](https://github.com/vime-js/vime/compare/v3.2.2...v4.0.0) (2020-09-20)


### Bug Fixes

* **angular:** add new ui components to vime module ([b1712de](https://github.com/vime-js/vime/commit/b1712ded131b3f96a8c964884b4887ccb26b33a2))
* **core:** update themes distribution ([bf3aaca](https://github.com/vime-js/vime/commit/bf3aaca3bf7a0fec4f2104632b79c42ed48e8c51))
* export only types from components ([4ec48a1](https://github.com/vime-js/vime/commit/4ec48a16db110cfa3876b72565a1a3572ff4c563))
* prefix all css variables with `vm` ([c00da36](https://github.com/vime-js/vime/commit/c00da3600f02c24cb0daee9e256474e0f69dddc0))


### Features

* **ui:** new double click fullscreen component ([0ede81b](https://github.com/vime-js/vime/commit/0ede81b7d02f4495144453a24d3276235c8b7d12))
* **ui:** new skeleton component ([9a0e0eb](https://github.com/vime-js/vime/commit/9a0e0ebcafc7b730f1c43cbc8a599193d19082a6))


### BREAKING CHANGES

* **ui:** `noSkeleton` player prop was moved to `DefaultUi`.
* Styling will break as all the CSS variables used
throughout the player now require the `vm` prefix.





## [3.2.2](https://github.com/vime-js/vime/compare/v3.2.1...v3.2.2) (2020-09-17)


### Bug Fixes

* update vime description ([625f14a](https://github.com/vime-js/vime/commit/625f14ae3d0fbdd830fc6a33d035898da9ee3552))





## [3.2.1](https://github.com/vime-js/vime/compare/v3.2.0...v3.2.1) (2020-09-14)


### Bug Fixes

* incorrect typing on `extendLanguage` method ([7a5bdc6](https://github.com/vime-js/vime/commit/7a5bdc673fb5ed247792319bd2bf414ae261bcd8))





# [3.2.0](https://github.com/vime-js/vime/compare/v3.1.0...v3.2.0) (2020-09-14)


### Features

* language translation interface ([2f99724](https://github.com/vime-js/vime/commit/2f99724b34b95d33fdc9207533b5e9dc05fdb304))





# [3.1.0](https://github.com/vime-js/vime/compare/v3.0.2...v3.1.0) (2020-09-11)


### Bug Fixes

* apply all dispatched changes in raf callback ([4aa617c](https://github.com/vime-js/vime/commit/4aa617cd100a1a98a6d2a69e0174cf8607fcc3b7))
* playback rate/quality change not calling adapter ([3e73a4f](https://github.com/vime-js/vime/commit/3e73a4ff9c4a3245f685a7040106c77f82317f08))
* **ui/controls:** only hide on mouse leave when not paused ([84af138](https://github.com/vime-js/vime/commit/84af1387ef273f23c4b9f7f9bc20745f19d1be36))


### Features

* allow tooltips to be positioned above/below on predefined controls ([dad2424](https://github.com/vime-js/vime/commit/dad24245a8dd576c67eadc005f7fe6749222b94e))





## [3.0.2](https://github.com/vime-js/vime/compare/v3.0.1...v3.0.2) (2020-09-11)


### Bug Fixes

* **ui/default-controls:** hide on mouse leave option not working ([93b467c](https://github.com/vime-js/vime/commit/93b467c79bd531cdd3316a240f9916cda4c408ec))





## [3.0.1](https://github.com/vime-js/vime/compare/v3.0.0...v3.0.1) (2020-09-10)


### Bug Fixes

* include loader in new releases ([0b7e0aa](https://github.com/vime-js/vime/commit/0b7e0aa7ff5f8bce3c5ffa75262a246c45979a35))





# 3.0.0 (2020-09-10)


### Bug Fixes

* add icons/themes to github package ([a16dc02](https://github.com/vime-js/vime/commit/a16dc0253a250ef117cbfee4da672a361364b5c1))
* all event names should be prefixed with v ([af62e25](https://github.com/vime-js/vime/commit/af62e255331e21cadfce69676298c9c03e13cd63))
* clean up changelogs ([093bcde](https://github.com/vime-js/vime/commit/093bcdec9baea44d46ec217dcdc51c4236eb255b))
* cleanup internals and integrations ([5e21c3b](https://github.com/vime-js/vime/commit/5e21c3b936e7e81fcfd60bb8b14e8f185b701039))
* cleanup settings css ([8d6021f](https://github.com/vime-js/vime/commit/8d6021fb41b830bc7db910ce2b26a092c0223582))
* default settings menu not rebuilt correctly ([82ac752](https://github.com/vime-js/vime/commit/82ac7523d4fe71bdad388717bcf17b45cadd6e70))
* force native controls if custom ui cannot be shown ([de0e8bc](https://github.com/vime-js/vime/commit/de0e8bc312ca16ec3c276797b5ddee2040812b90))
* include auto-gen code for libraries in git ([8bb7cf4](https://github.com/vime-js/vime/commit/8bb7cf4f655f67d2c5838a4f0c1ffb4390eaa8f2))
* make direct adapter calls when playback ready ([4b70458](https://github.com/vime-js/vime/commit/4b70458c9ba7530ac9631c2e007cd3150447302f))
* packages should use @vime/core@^2 ([9703777](https://github.com/vime-js/vime/commit/9703777d9f1d6dec8f6db7ffb4010f96b0a7d421))
* scrubber tooltip locks up at edges ([b386c34](https://github.com/vime-js/vime/commit/b386c34c738cc6ed08da2dee0beaaa905477a6f4))
* settings has no bg color ([171bfa5](https://github.com/vime-js/vime/commit/171bfa5f9213ae80ba45802251ea77626b84e7e3))
* show native controls when hiding custom ui on iOS ([ef1ff79](https://github.com/vime-js/vime/commit/ef1ff7996ab989c57a52a2b79fa11afd03ceacb3))
* snappier initial loading ([a7e4283](https://github.com/vime-js/vime/commit/a7e428314c05a4e19adaf5f9e370bdc0b0b2b1f4))
* support collision detection with multiple controls ([b8b5d4d](https://github.com/vime-js/vime/commit/b8b5d4d8a1ce76b2488078af36ef902a427c103e))
* throw error when `findRootPlayer` fails ([2f1f250](https://github.com/vime-js/vime/commit/2f1f250ba9ac399bdfbe120b610735dba7e52bbc))
* **angular:** release script broken ([32b733b](https://github.com/vime-js/vime/commit/32b733b695fcc84fc94e162e4dd462d1bac2aeff))
* **angular:** silence implicit any errors ([d59ce58](https://github.com/vime-js/vime/commit/d59ce58e4c928d049c8ff19630f9344c7b3543f1))
* **core:** icons not loading ([dd16dea](https://github.com/vime-js/vime/commit/dd16dea34a7539d7dc62f4983fbcc5a4be30ae24))
* **core:** lazy loading broken ([8c626a7](https://github.com/vime-js/vime/commit/8c626a7538de01f88c230c90cc0dc5c540b3bc3b))
* **core:** performance improvements to applying state changes ([e3e121b](https://github.com/vime-js/vime/commit/e3e121bcb19a1165a5145fb21d62abe63e2e3aea))
* **core:** prevent posters loading twice with custom UI ([525e713](https://github.com/vime-js/vime/commit/525e713cb213223d8544b807801ca6a71f133a00))
* **core:** remove coverage instrumentation from dist ([e6552ca](https://github.com/vime-js/vime/commit/e6552ca7cfc553efb2b39002f65dbad2185d28f6))
* **core:** remove invalid unpkg/jsdelivr keys ([86d08c2](https://github.com/vime-js/vime/commit/86d08c281118740a63d3d1f02dab43107495097e))
* **core:** video bg looks off in fullscreen ([2423812](https://github.com/vime-js/vime/commit/2423812d2d3d60e23f8a041e8541f63ca28c84a2))
* **svelte:** should import player store from dist ([6edd51b](https://github.com/vime-js/vime/commit/6edd51b43f0c5a4bbe7ca305b78237a082b96453))
* cannot be bundled without svg plugin or loader ([37feb2b](https://github.com/vime-js/vime/commit/37feb2b1e1d46bc421f2056d0d59b9dba280f8a9))
* enforce stricter eslint rules ([26ea8a2](https://github.com/vime-js/vime/commit/26ea8a2c036c048bb11a5d90a080e10aec0c0d1d))
* sliders broken on firefox ([cfbdc57](https://github.com/vime-js/vime/commit/cfbdc57b9c29f64c5a7a5ffeb7c91fa266a606e2))
* type error thrown when ui root not found ([b638607](https://github.com/vime-js/vime/commit/b6386077a0266d7ecb6b5049271b45a69cc67f83))
* **core/default-controls:** no scrim on desktop video when using light theme ([1ee8dc0](https://github.com/vime-js/vime/commit/1ee8dc03990a6ec9750d3f46eedb863c1e14ac8a))
* **core/ui/captions:** toggling captions on/off broken ([ccaf941](https://github.com/vime-js/vime/commit/ccaf94104ab4d2123b087886303b97d081c340a7))
* **svelte:** incorrect event types ([75bab44](https://github.com/vime-js/vime/commit/75bab443c1dcf834383d86b3ffbaf54dede758fa))
* stricter typing on player context ([0c71f74](https://github.com/vime-js/vime/commit/0c71f74f4f94d6a5be7cf1a70cb8ff8ec70b272e))
* use lower case `PlayerProp` names for consistency ([a9fd6e1](https://github.com/vime-js/vime/commit/a9fd6e155f9457abc03e670e2b4b9920b45daab0))
* usePlayerContext not working if used on same ref ([9fc457e](https://github.com/vime-js/vime/commit/9fc457e523094d69bff19b5894ba2c85db2c734f))
* **core:** context connection failing if player ready ([ff4dee4](https://github.com/vime-js/vime/commit/ff4dee46a16dc919bfb410ad0553edd692b54774))
* **core:** point unpkg and jsdelivr to correct file ([b7e20bd](https://github.com/vime-js/vime/commit/b7e20bd02984b5578e9e36f0f0a00f4d7fd577fd))
* **core/ui:** slider keydown events propagating ([cbf0e90](https://github.com/vime-js/vime/commit/cbf0e904ef4b49255559437d31ffe0ecbc2a8638))
* **core/ui/captions:** emitting events after disconnecting ([98b9c85](https://github.com/vime-js/vime/commit/98b9c85ac31007595535df3beb5aba628fb7c00d))
* **core/ui/time:** time not aligned correctly ([ce57d1d](https://github.com/vime-js/vime/commit/ce57d1d5504756485f1851e7dcd3675e112248c0))
* **preview:** improve loading detection and event firing ([a7303a7](https://github.com/vime-js/vime/commit/a7303a7b4e3b5f8cf2e6426a9b970a71487a3af1))
* **preview:** poster not displaying ([e6ea00d](https://github.com/vime-js/vime/commit/e6ea00d0c2cd46b1627b8e1bd014ea6a172ba8e7))
* ssr support ([7f994ec](https://github.com/vime-js/vime/commit/7f994ec57b9e1add4a2930e04d81904f4e2cfae8)), closes [#38](https://github.com/vime-js/vime/issues/38)
* **preview:** static folder missing in release ([376a724](https://github.com/vime-js/vime/commit/376a7243bda9ab6a667d0dea5de875e3286be40e))


### Features

* allow passing params to embed as query string ([930d098](https://github.com/vime-js/vime/commit/930d098dabb273ef0b0c76537689063f745774f1))
* export findRootPlayer utility ([f62de47](https://github.com/vime-js/vime/commit/f62de47046f4a7e0649a93c68aeef01e32c950e4))
* export loadSprite helper ([173e6dd](https://github.com/vime-js/vime/commit/173e6ddd1b517233bd46bc94e6bda891f4a1e403))
* move z-index values to css variables ([a5fae97](https://github.com/vime-js/vime/commit/a5fae97f107f83b2aef1ac9fe03acf93c947f6c5))
* new mounted + destroyed props ([9393e6b](https://github.com/vime-js/vime/commit/9393e6b159c3c65b2f7e781233ef23855b786451))
* simplify control/icon styling ([7b9aaf6](https://github.com/vime-js/vime/commit/7b9aaf68890b560aad31f6b941082e46f9700930))
* skeleton loading animation ([5afb198](https://github.com/vime-js/vime/commit/5afb19856a8d918200df7a334593b29800358485))
* **angular:** create angular bindings/package ([edd1e20](https://github.com/vime-js/vime/commit/edd1e20acb17af8ba5e5f63ea7e33715d1ba96af))
* **core:** add lazy loading via lozad ([e1f3db2](https://github.com/vime-js/vime/commit/e1f3db23705caa2f248a7087c85d5e5cf78f36be))
* **core:** add skeleton loading animation ([da106ba](https://github.com/vime-js/vime/commit/da106baf13b42f2f48e75d59f7bcc5549a448099))
* **core:** improve test harness + vimeo provider ([416ff35](https://github.com/vime-js/vime/commit/416ff35b585b1d1b7262adad54aacc921dfd9de5))
* **core:** vime-player component ([8c47582](https://github.com/vime-js/vime/commit/8c475823cc3834c5af06dc226a7f89aa156c8e28))
* **core/ui:** controls components ([f843dca](https://github.com/vime-js/vime/commit/f843dcad3207414c3736a64bd8fb59b1440e6cf3))
* **core/ui:** create settings components ([d364df1](https://github.com/vime-js/vime/commit/d364df11157fae7074cec3c2bab95e60dfed8bad))
* **core/ui:** icons + icon component ([c3b1106](https://github.com/vime-js/vime/commit/c3b110638a219efdc1d7ef9e1f0de120849372a2))
* **core/ui:** poster + spinner components ([46a4fd4](https://github.com/vime-js/vime/commit/46a4fd45464441c406f73d93ee4dbd17c7c7cc05))
* **core/ui/poster:** add poster events ([aa32961](https://github.com/vime-js/vime/commit/aa32961f3d7362fb4406b6f3085584f0b71adfbd))
* **core/ui/scrim:** add events ([640ada4](https://github.com/vime-js/vime/commit/640ada43f880cb388fb8bf846b9a4e1f7cbbd4e8))
* **core/ui/scrim:** add gradient option ([d3c6d2c](https://github.com/vime-js/vime/commit/d3c6d2c8da9a5efd729316081b870a2745b11223))
* **core/ui/settings:** add audio/mobile styles to settings ([41ade70](https://github.com/vime-js/vime/commit/41ade702d426ee3ede73fa79b7e1fad1516f4549))
* **preview:** tweaked design of play icon and it can now be scaled ([25f28dd](https://github.com/vime-js/vime/commit/25f28dda140817c30250f8db6c4079e079cd3478))
* **providers/file:** reload on source changes ([b782ab3](https://github.com/vime-js/vime/commit/b782ab30985855dd131873adc7099c71129eebe7))
* **providers/file:** watch source elements for changes and call load ([a4e0165](https://github.com/vime-js/vime/commit/a4e0165ee7b323e75694ae44eb52237eb4331c86))
* refactor packages from providers to players ([1ed31f2](https://github.com/vime-js/vime/commit/1ed31f2810219e17d21f905f7663d02e47e6ec21))
* upgrade to @stencil/core@2.0.0-8 ([e85f6c0](https://github.com/vime-js/vime/commit/e85f6c0e4eccae00949fb2e219594e3808e02c89))
* **react:** add react bindings for vime ([8ec4a11](https://github.com/vime-js/vime/commit/8ec4a119fce27e4b7e3f26e7c00d771064c467b9))
* **svelte:** all new svelte bindings ([acfb943](https://github.com/vime-js/vime/commit/acfb943d12ebabe176dbd5785ea0a3a2b39cc758))
* **svelte:** new usePlayer helper ([f19823b](https://github.com/vime-js/vime/commit/f19823b80b6d3c2dadfd9ad7ba64ea7826fee0d7))
* add new theme prop ([f120943](https://github.com/vime-js/vime/commit/f120943f823a7a4938df5bae444bb7c99ad39c1c))
* improve all framework integrations ([3eb4de7](https://github.com/vime-js/vime/commit/3eb4de767c803e3631e7304d2266b9276ec2ecdc))
* new svelte store option ([e49f6f8](https://github.com/vime-js/vime/commit/e49f6f8e1e7e3fd3d521116fc20f641d8a233d6a))
* **core:** @stencil/core@2.0.0-3 ([0e3f5d2](https://github.com/vime-js/vime/commit/0e3f5d231b48ba9355791919f69e8a92f7278aa9))
* **core:** create themes dir and split default/light themes ([37a5df5](https://github.com/vime-js/vime/commit/37a5df5f63823d3d16ec9d791fc8c7f9ecd96017))
* **core:** dailymotion + hls + dash providers ([93e9f06](https://github.com/vime-js/vime/commit/93e9f06c46ce53f9774b9817d0831d1a57057765))
* **core:** export player event enum ([7cf5797](https://github.com/vime-js/vime/commit/7cf57979463da93ebecb281c25ae0c7cfbb9b2a8))
* **core:** vime-embed component ([09717d2](https://github.com/vime-js/vime/commit/09717d2e3175f3953cd6d399c9eb324bc14203c7))
* **core:** youtube provider + providers test harness ([4684e86](https://github.com/vime-js/vime/commit/4684e86683b824462e20f623755717762a21ce4f))
* **core/ui:** captions component ([1b91570](https://github.com/vime-js/vime/commit/1b9157068cbbb5dcfb4437aac7f29d0c5e93c452))
* **react:** export player event enum ([e09eba6](https://github.com/vime-js/vime/commit/e09eba664b0c2801a3318236836225ba70d5fc7e))
* @stencil/core@2.0.0-2 ([90fd2e8](https://github.com/vime-js/vime/commit/90fd2e8522c8dae6101e4fe52fb9052f56f5323a))
* add media package ([8ee6e89](https://github.com/vime-js/vime/commit/8ee6e89ecee5f5090fa1f433f6ae55602ceb1f7c))
* you can now build custom ui components + new react hooks ([b4f7b51](https://github.com/vime-js/vime/commit/b4f7b519901874a6ba59c53d504adacf32259fa1))
* **core/ui:** add click-to-play component ([2d78c49](https://github.com/vime-js/vime/commit/2d78c496628e7f2f5d7112116b39dd3907213a86))
* **core/ui:** add light audio player theme ([f42c9fe](https://github.com/vime-js/vime/commit/f42c9fea2b43b5620cf60eb4543dad6df932d702))
* **core/ui:** scrim component ([9a2c970](https://github.com/vime-js/vime/commit/9a2c97095bef6aa3935b06427390b603706d033e))
* **core/ui/controls:** add option to scale control size up/down ([09ab967](https://github.com/vime-js/vime/commit/09ab96748abd4a1918ee43eb5129dbb185e8fcaa))
* **core/ui/spinner:** add events ([45ee9e3](https://github.com/vime-js/vime/commit/45ee9e395e9d12e452c276c1807ceecf5a26d394))
* **preview:** inline play icon to avoid additional setup ([8789491](https://github.com/vime-js/vime/commit/87894915f9f453461c8e61ba3f2d7ee89479ad55))
* **vue:** create vue bindings/package ([c034fe5](https://github.com/vime-js/vime/commit/c034fe59bba3b62ab2c919757ee7fb53c93b8a74))


### BREAKING CHANGES

* export changes listed below.

- `PlayerProp` is now a type (union of strings) and not enum.
- `PlayerEvent` is now a type (union of strings) and not enum.
- `useInternalPlayerContext` has been removed from `@vime/react`.
- `useInternalPlayerStore` has been removed from `@vime/svelte`.
- Providers dispatch changes in a separate event (`vmProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.
