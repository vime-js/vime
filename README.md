<div align="center">
  <a href="#">
    <img
      width="250px"
      alt="vime"
      src="https://raw.githubusercontent.com/vime-js/vime/master/static/brand/vime-logo--dark.svg?sanitize=true"
    />
  </a>

  <br />
  <br />

  [Documentation][vime-docs] | [Playground][vime-playground]

  <br />

  [![version-badge]][package]
  [![license-badge]][license]
  [![prs-badge]][prs] 
  [![lerna-badge]][lerna]
  [![github-star-badge]][github-repo]
  [![tweet-badge]][tweet]
</div>

## Table of Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [What is Vime?](#what-is-vime)
- [Svelte](#svelte)
  - [What is Svelte?](#what-is-svelte)
  - [Why Svelte?](#why-svelte)
- [Motivation](#motivation)
- [Warnings](#warnings)
- [Screenshots](#screenshots)
- [Features](#features)
- [Support](#support)
- [Questions](#questions)
- [Where to next?](#where-to-next)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is Vime?

Vime is an open-sourced library built with [Svelte][svelte], focused on making embedding and using media elements 
for the web simple. The idea behind Vime is **we want you to control the player, not the other way around**. We built all of Vime 
with that in mind. Thus, we focus on normalizing cross-browser and provider (YouTube, Vimeo, Dailymotion etc.) 
differences, all powered by an reactive/eventful store, modular design, powerful plugin system and much more.

## Svelte

### What is Svelte?

> Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like 
React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step 
that happens when you build your app. Instead of using techniques like virtual DOM diffing, Svelte 
writes code that surgically updates the DOM when the state of your app changes.

### Why Svelte?

* **Framework Agnostic**. Svelte compiles down to Vanilla JS so you can use it anywhere, regardless of what 
framework you choose. This comes with all the benefits of a modern JS framework like React or Vue but without 
all the baggage.

* **Lightweight**. Svelte code is terse in a non-cryptic way, it **can** (not will) enable us to naturally write less
code (see [Write Less Code][write-less-code]). In addition, Svelte is able to infer at compile-time
the minimal number of steps required to perform the change you're seeking, whether this is updating
computed properties or the DOM. Through inserting import statements of only small utility like 
functions, and taking advantage of treeshaking, the final bundle size is ridiculously small. There is 
still the hovering question of does it scale, for that checkout [Yes but does it scale?][does-it-scale]

* **Performant**. In contrast with a virtual DOM approach, which comes with the overhead of being stored 
in memory and the cost of diffing (see [Virtual DOM is Pure Overhead][vdom-overhead]),
Svelte inserts code that interfaces with only the part of the DOM that is necessary. Thus, when a change occurs, 
only the part of the DOM that is affected is recomputed and updated if necessary. In addition, Svelte is able to 
at compile-time analyze our code and make optimizations to increase performance, an example of this is 
using dependency graph resolution on computed properties to propagate changes with minimal overhead.

* **Store Flexibility**. Svelte's [store contract][svelte-store-contract] interoperates with 
libraries like RxJS. Today we rely on Svelte's simple built-in store in the background for storing
state and propagating changes, but we are planning on moving towards a more declarative and predicatable 
state management flow with a library like RxJS, and the ability to easily switch over is crucial.

💡 Checkout this excellent write up called [Why Svelte?][why-svelte]

[write-less-code]: https://svelte.dev/blog/write-less-code
[why-svelte]: https://github.com/feltcoop/why-svelte
[vdom-overhead]: https://svelte.dev/blog/virtual-dom-is-pure-overhead
[does-it-scale]: https://github.com/sveltejs/svelte/issues/2546
[svelte-store-contract]: https://svelte.dev/docs#svelte_store

## Motivation

The main issue with alternative solutions like [Videojs][github-videojs] and [Plyr][github-plyr] is:

* They are **not modular/treeshakable** and come with too many built-in features that most users simply don't need. This 
bloats the package size and the final bundle includes useless code.

* Poor **plugin ecosystem** or none at all. Plyr doesn't have a plugin system which makes it difficult
for the community or devs to extend the player. Videojs has mostly basic plugins and a majority are outdated
or not actively maintained. 

* **Poor multi-provider support.** Plyr only supports Vimeo and YouTube at this time and there
is no simple way to add a custom provider. Videojs supports multiple providers through custom `Tech`
but there is technically none supported out of the box. The community plugins 
that add support for them are outdated and don't work (see [videojs-youtube](https://github.com/videojs/videojs-youtube/issues/547) 
and [videojs-vimeo](https://github.com/videojs/videojs-vimeo/issues/151)).

* Both libraries use **Player SDKs** to integrate each provider which causes additional bloat. Each SDK is 
repeating mostly the same code for mounting and building the `iframe`, cleaning event listeners etc. 
Each can weigh as much as ~10 kB. Thus, after adding only 3 providers such as YouTube, Dailymotion and 
Vimeo you'll incur an additional 25 - 30 kB overhead.

* They are not built with modern **UI framework** capabilities. We've learnt a lot about building user interfaces
over the last decade. It's best to not reinvent the wheel and use existing frameworks. Most importantly, they help with
providing structure, solutions to common problems, code reusability, improved development experience 
and a quicker time-to-contribute (time it takes a dev to understand a new codebase and contribute). Plyr and 
Videojs are completely Vanilla JS. This was likely a conscious decision to make sure the libraries are interoperable between 
JS frameworks. However, a new wave of [compile-time frameworks](https://peteroshaughnessy.com/posts/disappearing-frameworks/) 
like [Svelte](https://svelte.dev), [Stencil](https://stenciljs.com/) and [Ember](https://emberjs.com/)
are reducing the costs of choosing to use a framework. Two examples of how not using a framework affects Videojs and Plyr is:

  * Videojs decided to design its own [Component](https://github.com/videojs/video.js/blob/master/src/js/component.js) class 
  for managing UI state. Besides the fact that it's 1700 lines of code, it's hard to build anything meaningful with it. 
  If you're intending on building complex UI components/plugins for your player, then you simply need to find your own recipe for 
  making it happen.

  * The codebase for Plyr is a jungle with logic tangled up all over the place. For example, understanding 
  [1700 lines of code](https://github.com/sampotts/plyr/blob/master/src/js/controls.js) for just the controls 
  is simply too much.

* Lack of **testing**. Videojs has a good set of unit tests but no e2e tests, and Plyr has no tests at all. 
This makes both libraries vulnerable to breakage. I'll admit Vime has no tests just yet either, 
but it is one of our highest priorities.

📝  ***If you think I got something wrong or you can improve what's been said then please create a PR.***

## Warnings

- If you're looking for something that has battled the test of time and is realiable today in a 
large production app, then Vime is not for you. You should go ahead and checkout [Videojs][github-videojs] 
and [Plyr][github-plyr]. 

- IE 11 has not been tested at all. There will definitely be bugs. If this is important to you, then don't use Vime in production just yet.

## Screenshots

<img
  width="100%"
  alt="vime"
  src="https://raw.githubusercontent.com/vime-js/vime/master/static/images/player-example.png"
/>

<img
  width="100%"
  alt="vime"
  src="https://raw.githubusercontent.com/vime-js/vime/master/static/images/player-example-2.png"
/>

## Features

* **Responsive Design.** The player and all our plugins are designed for mobile, touch and larger screens.

* **Accessible.** All controls and menus are built with accessibility in mind, and VTT captions are supported.

* **Options.** There is an option for whatever your use case. Thumbnails preview, lite player embed, standard
player for a normalized experience, and a complete system with plugins and all.

* **Lightweight.** 0 external dependencies, modular, treeshakable, no additional SDK's loaded, and compiled with 
Svelte to have the smallest footprint possible. Sizes ranging from 5.5 kB (min + gzip) up to everything 
included at 54 kB (min + gzip).

* **Avoid browser inconsistencies.** Browsers each approach new API's differently and this can be quite
a headache. Vime handles it all so you don't. Enjoy fullscreen, picture-in-picture and more without 
any pain.

* **Multi-provider support.** Out of the box at the moment we support Html5, YouTube, Vimeo and Dailymotion.
Dont' bother learning a new SDK everytime, just use Vime!

* **Reactive/eventful store.** Behind the scences, all properties are a Svelte store. Subscribe to anything you
like and receive updates in realtime.

* **I18n.** Internationalization is built right in. Easy to add, extend and change as needed. English
is provided out of the box and more languages to come.

* **Portable.** Since Svelte compiles down to Vanilla JS, you can use it anywhere you like. For an 
even better experience we'll be building framework intergations starting with React and Vue.

* **Lazy loading.** All players are loaded lazily as soon as they are almost in view.

* **Design**. A minimalistic, modern and sleek design which you can customize with your own icons and theme. See
screenshots above for our base design.

* **Modular Design + Plugin System.** Include only the parts you need and benefit from treeshaking to remove the 
waste. Outside of the core, everything is built as a plugin so you can integrate only what you need. There are 
plugins for Keyboard shortcuts, Controls, Tooltips, Settings and much more. There is even a handy Boot plugin, if you want 
to use everything with no additional setup required. The plugin system utilizes `svelte:component` so you can extend 
the player with the full power of Svelte.

* **Built with Svelte.** Enjoy great performance and a smaller bundler thanks to Svelte. If you're using 
Vime inside a Svelte project, we've provided a `svelte` key so you can compile the player yourself 
and share the same Svelte internals. This will reduce the overhead cost of Vime, and you get all the 
benefits of auto-subscriptions since all props are powered by a store.

* **Complete control**. Remember, we want you to control the player, not the other way around. We've
built all of Vime with that in mind. Pick what you want, extend what you want, interact with what you want, 
pretty much do whatever you want easily.

## Support

Vime is focused on supporting the last 2 versions of all modern browsers and IE 11.

- [x] Safari
- [x] iOS Safari
- [x] Firefox
- [x] Chrome
- [x] Opera
- [x] Edge
- [ ] IE 11 (most likely broken at the moment as no testing has been performed on it)

## Questions

Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/vime-js) with the tag `vime-js`.

## Where to next?

You can head over to the [playground][vime-playground] to play or you can [get started][vime-getting-started]
straight away.

## License

[MIT][license]

[svelte]: https://svelte.dev
[lerna]: https://lerna.js.org
[package]: https://www.npmjs.com/package/@vime-js/player
[license]: https://github.com/vime-js/vime/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/vime-js/vime?color=blue&style=flat-square
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[version-badge]: https://img.shields.io/npm/v/@vime-js/player?style=flat-square
[lerna-badge]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square
[tweet]: https://twitter.com/intent/tweet?text=Check%20out%20Vime%20%28https%3A%2F%2Fgithub.com%2Fvime-js%2Fvime%29%2C%20it%20makes%20embedding%20and%20using%20media%20players%20for%20the%20web%20simple.%20It%20supports%20Html5%2C%20YouTube%2C%20Dailymotion%2C%20Vimeo%20and%20more%20to%20come%21
[tweet-badge]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fvime-js%2Fvime
[github-repo]: https://github.com/vime-js/vime
[github-star-badge]: https://img.shields.io/github/stars/vime-js/vime?style=social
[github-videojs]: https://github.com/videojs/video.js
[github-plyr]: https://github.com/sampotts/plyr
[vime-docs]: https://vime-js.com
[vime-playground]: https://playground.vime-js.com
[vime-getting-started]: https://vime-js.com/getting-started