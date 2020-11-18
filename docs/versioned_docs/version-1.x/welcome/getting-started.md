---
title: Getting Started
sidebar_label: Getting Started
---

The following 4 options are available:

* **Preview** for displaying custom or provider loaded thumbnails. These are loaded lazily, have an 
optional play icon and a few other treats.

* **Lite** lightweight and super powerful media embed. The difference between Lite and traditional methods
  for embedding media is:
  
  * **Loaded lazily**. See the benefits of lazy loading [here][lazy-loading-benefits].
  
  * Utilizes **preconnections** for an approximately [224x faster load][preconnections-benchmark].
  
  * **Lighter than provider SDK's**. Lite comes in at ~ 6 kB which is on average 50% lighter than provider built
  player SDK's. Furthermore, each additional provider added only increases the total cost by about ~ 300 bytes. For 
  example, if you normally wanted to embed media from YouTube, Dailymotion and Vimeo, the total 
  player SDK cost would be ~25 kB. In contrast, with Vime it'll be ~ 6.5 kB.

  * **Multi-provider support.** One interface for multiple providers. If you want to switch from YouTube 
    to Vimeo, no problem. If you want to support both, no problem. All you really need to know is
    the media you want to embed, we take care of the rest.
  
  * You send commands and receive messages from the embed via [`postmessage`][mdn-postmessage]. However, 
  we take the pain out of it by storing your commands and sending them when the player is ready for playback,
  and we decode any messages received into a POJO.

* **Standard** for when you want all Lite features but you want to interact with the provider/embed through the 
  [core Vime player interface](../standard/api/player.md) (not via `postmessage`). Thus, you avoid browser/provider 
  differences and get access to the store.

* **Complete** for when you want all Lite and Standard features + the ability to completely customize 
  the player with plugins.

[lazy-loading-benefits]: https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video
[preconnections-benchmark]: https://github.com/paulirish/lite-youtube-embed
[mdn-postmessage]: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

## Features / Differences

| Feature                   | Preview |    Lite    |  Standard  |   Complete    |
| :------------------------ | :-----: | :--------: | :--------: | :-----------: |
| Size (min + gzip)         | 4.85 kB | 6 - 6.6 kB | 13 - 20 kB | 25 kB - 54 kB |
| Lazy Loading              |    ✓    |     ✓      |     ✓      |       ✓       |
| Preconnections            |    ✓    |     ✓      |     ✓      |       ✓       |
| Thumbnails                |    ✓    |     ✓      |     ✓      |       ✓       |
| Native Controls           |         |     ✓      |     ✓      |       ✓       |
| Native Player API         |         |     ✓      |     ✓      |       ✓       |
| Multi-provider Support    |         |     ✓      |     ✓      |       ✓       |
| Vime Player API           |         |            |     ✓      |       ✓       |
| Provider Normalization    |         |            |     ✓      |       ✓       |
| Browser Normalization     |         |            |     ✓      |       ✓       |
| Reactive / Eventful Store |         |            |     ✓      |       ✓       |
| Plugins                   |         |            |            |       ✓       |
| Customization             |         |            |            |       ✓       |
| Custom Controls           |         |            |            |       ✓       |
| Internationalization      |         |            |            |       ✓       |

### Notes

1. Custom controls are available via plugins.
2. All plugins are designed to be responsive and built with accessibility in mind.
3. The size of 'Standard' depends on the providers you use.
4. The size of 'Complete' depends on the plugins and providers you use.
5. Sizes may be outdated at the time of reading this, see respective package for an accurate upper bound.

## Where to next?

If you're not using good old HTML/CSS/JS and are interested in any specific library/framework integration, 
you can follow one of these guides:

- [Svelte](../integrations/svelte.md)

After that you can get started with any of the following packages:

- [Preview](../preview/setup.md)
- [Lite](../lite/setup.md)
- [Standard](../standard/setup.md)
- [Complete](../complete/setup.md)
