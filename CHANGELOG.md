# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
- Providers dispatch changes in a separate event (`vProviderChange`).
- Scheduler has been removed and merged in a simpler form into the `Player`.
- The `mounted` and `destroyed` props have been replaced with `attached`.
