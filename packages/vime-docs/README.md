# Introduction

### What is Vime?

Vime is an open-sourced library built with [Svelte](https://svelte.dev/), focused on making embedding and using media elements for the web simple. The idea behind Vime is **we want you to control the player, not the other way around**. We built all of Vime with that in mind. Thus, we focus on normalizing cross-browser and provider \(YouTube, Vimeo, Dailymotion etc.\) differences, all powered by an reactive/eventful store, modular design, powerful plugin system and much more.

### Svelte

#### **What is Svelte?**

> Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app. Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes.

**Why Svelte?**

**Framework Agnostic**. Svelte compiles down to Vanilla JS, you can use it anywhere, regardless of what framework you choose. This all comes without the baggage of the entire Svelte internal system, only the parts we need come along for the ride.

**Lightweight**. Svelte code is terse in a non-cryptic way, it **can** \(not will\) enable us to naturally write less code \(see [Write Less Code](https://svelte.dev/blog/write-less-code)\). In addition, Svelte is able to infer at compile-time the minimal number of steps required to perform the change you're seeking, whether this is updating computed properties or the DOM. Through inserting import statements of only small utility like functions, and taking advantage of treeshaking, the final bundle size is ridiculously small. There is stil the hovering question of does it scale, for that checkout [Yes but does it scale?](https://github.com/sveltejs/svelte/issues/2546)

**Performant**. In contrast with a virtual DOM approach, which comes with the overhead of being stored in memory and the cost of diffing \(see [Virtual DOM is Pure Overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead)\), Svelte inserts code that interfaces with only the part of the DOM that is necessary. Thus, when a change occurs, only the part of the DOM that is affected is recomputed and updated if necessary. In addition, Svelte is able to at compile-time analyze our code and make optimizations to increase performance, an example of this is using dependency graph resolution on computed properties to propagate changes with minimal overhead.

**Store Flexibility**. Svelte's [store contract](https://svelte.dev/docs#svelte_store) interoperates with libraries like RxJS. Today we rely on Svelte's simple built-in store in the background for storing state and propagating changes, but we are planning on moving towards a more declarative and predictable state management flow with a library like RxJS, and the ability to easily switch over is crucial.

{% hint style="info" %}
Checkout this excellent write up called [Why Svelte?](https://github.com/feltcoop/why-svelte)
{% endhint %}

#### Motivation

The main issue with alternative solutions like [Videojs][github-videojs] and [Plyr][github-plyr] is:

* They are **not treeshakable** and come with too many built-in features that most users simply don't need. This 
bloats the package size and makes it hard to extend or play with the library.

* Poorly implemented **plugin system** or none at all. This makes it difficult for users
to control and extend the player. Plyr doesn't have a plugin system, and most plugins for Videojs 
tend to be outdated or not actively maintained (see [videojs-youtube](https://github.com/videojs/videojs-youtube/issues/547) and
[videojs-vimeo](https://github.com/videojs/videojs-vimeo/issues/151)).

* **Poor multi-provider support.** Plyr only supports Vimeo and YouTube out of the box and there
is no simple way to add a custom provider. Videojs supports multiple providers through custom `Tech`
but there is technically none supported out of the box. As mentioned in the last point, the community plugins 
that add support for them are outdated and don't work.

* Using **Player SDKs** to integrate each provider causes additional bloat. Each SDK is pretty much
repeating mostly the same code for mounting and building the `iframe`, cleaning event listeners etc. 
Each can weigh as much as ~10 kB and is not part of the base package size. This means after adding 
3 providers such as YouTube, Dailymotion and Vimeo you'll incur an additional 25 - 30 kB overhead.

* Not built with modern **UI framework** capabilities. We've learnt for more than a decade that 
building UI's is hard. It's best to leverage the capabilities of existing frameworks. It's very difficult
to extend Plyr as it is, but Videojs has it's own [Component](https://github.com/videojs/video.js/blob/master/src/js/component.js)
class for managing UI state. It's hard to build anything meaningful using their component class. 
If you're intending on building complex UI components/plugins for your player, then you simply need to find your 
own recipe for making it happen. This is why most the plugins are generally pretty simple.

* Lack of **testing**. Videojs has a good set of unit tests but no e2e tests that I can find. I know this is
a difficult task for a video player but it is possible. Plyr has no tests at all. This makes both libraries
vulnerable to breakage, and new changes should be added with caution. I'll admit Vime has no 
tests just yet either, but it is one of our highest priorities.

* Side issue but the **codebase** for Plyr is somewhat a mess. Contributing to the project is very difficult. In my case, 
I wanted to add another provider and build my own control but there was no simple way to do it. Logic is tangled up all over the
place. Understanding 1700 lines of code for just the [controls](https://github.com/sampotts/plyr/blob/master/src/js/controls.js)
is simply too hard. However, this may be fixed in time.

{% hint style="info" %}
Think I got something wrong or you can improve what's been said? Create a PR over at our [GitHub repository](https://github.com/vime-js/vime). 
{% endhint %}

{% hint style="danger" %}
If you're looking for something that has battled the test of time and is reliable today in a large production app, then Vime is not for you today. You should go ahead and checkout [Videojs](https://github.com/videojs/video.js) or [Plyr](https://github.com/sampotts/plyr). 
{% endhint %}

{% hint style="danger" %}
 IE 11 has not been tested at all. There will definitely be bugs. If this is important to you, then don't use Vime in production just yet.
{% endhint %}

### Screenshots

![Vime player screenshot](.gitbook/assets/player-example.png)

![Vime player mid-playback screenshot](.gitbook/assets/player-example-2.png)

### Features

* **Responsive Design.** The player and all our plugins are designed for mobile, touch and larger screens.
* **Accessible.** All controls and menus are built with accessibility in mind, and VTT captions are supported.
* **Options.** There is an option for whatever your use case. Thumbnails preview, lite player embed, standard player for a normalized experience, and a complete system with plugins and all.
* **Lightweight.** 0 external dependencies, modular, treeshakable, no additional SDK's loaded, and compiled with Svelte to have the smallest footprint possible. Sizes ranging from 5.5 kB \(min + gzip\) up to everything included at 54 kB \(min + gzip\).
* **Avoid browser inconsistencies.** Browsers each approach new API's differently and this can be quite a headache. Vime handles it all so you don't. Enjoy fullscreen, picture-in-picture and more without any pain.
* **Multi-provider support.** Out of the box at the moment we support Html5, YouTube, Vimeo and Dailymotion. Don't bother learning a new SDK everytime, just use Vime!
* **Reactive/eventful store.** Behind the scenes, all properties are a Svelte store. Subscribe to anything you like and receive updates in realtime.
* **I18n.** Internationalization is built right in. Easy to add, extend and change as needed. English is provided out of the box and more languages to come.
* **Portable.** Since Svelte compiles down to Vanilla JS, you can use it anywhere you like. For an even better experience we'll be building framework integrations starting with React and Vue.
* **Lazy loading.** All players are loaded lazily as soon as they are almost in view.
* **Design**. A minimalistic, modern and sleek design which you can customize with your own icons and theme. See Screenshots above for our base design.
* **Modular Design + Plugin System.** Include only the parts you need and benefit from treeshaking to remove the waste. Outside of the core, everything is built as a plugin so you can integrate only what you need. There are plugins for Keyboard shortcuts, Controls, Tooltips, Settings and much more. There is even a handy Boot plugin, if you want to use everything with no additional setup required. The plugin system utilizes `svelte:component` so you can extend the player with the full power of Svelte.
* **Built with Svelte.** Enjoy great performance and a smaller bundler thanks to Svelte. If you're using Vime inside a Svelte project, we've provided a `svelte` key so you can compile the player yourself and share the same Svelte internals. This will reduce the overhead cost of Vime, and you get all the benefits of auto-subscriptions since all props are powered by a store.
* **Complete control**. Remember, we want you to control the player, not the other way around. We've built all of Vime with that in mind. Pick what you want, extend what you want, interact with what you want, pretty much do whatever you want easily.

### Support

Vime is focused on supporting the last 2 versions of all modern browsers and IE 11.

* [x]  Safari
* [x]  iOS Safari
* [x]  Firefox
* [x]  Chrome
* [x]  Opera
* [x]  Edge
* [ ]  IE 11 \(most likely broken at the moment as no testing has been performed on it\)

### Questions

Ask a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/vime-js) with the tag `vime-js`.

### License

[MIT](https://github.com/vime-js/vime/blob/master/LICENSE)

