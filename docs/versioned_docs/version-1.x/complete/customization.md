---
title: Customization
sidebar_label: Customization
---

This page will guide you on how to extend or customize the player. Refer to the [Player API](./api/player.md) 
for what props/methods/events are available and how to interact with them.

## Loading Providers

Providers are loaded via the `providers` prop.

```js
// All providers are named {ProviderName}Provider.
import { Player, FileProvider, YouTubeProvider } from '@vime-js/complete';

// ...

const player = new Player({ 
  target,
  props: {
    providers: [FileProvider, YouTubeProvider]
  }
});
```

:::info
Checkout the [provider notes](../standard/notes.md) for any provider specific issues or features.
:::

## Loading Plugins

Plugins are loaded via the `plugins` prop, see the plugins [getting started](../plugins/getting-started.md) 
page for more information.

```js
import { Player, Boot } from '@vime-js/complete';

// ...

const player = new Player({ 
  target,
  props: {
    // The Boot plugin installs all Vime plugins.
    plugins: [Boot]
  }
});
```

## Loading Icons

Icons are set via the `icons` prop. 

### Vime Icons

You can load the default Vime icons by using the `Icons` plugin.

```js
import { Icons } from '@vime-js/complete';

// If you're using the Boot plugin, it already loads this for you.
player.plugins = [Icons];
```

### Custom Icons

Create an SVG sprite and insert it into the head of the document. You can then override the 
following default icons.

- play
- pause
- captionsOn
- captionsOff
- enterFullscreen
- exitFullscreen
- enterPiP
- exitPiP
- seekForward
- seekBackward
- volumeLow
- volumeHigh
- volumeMute
- settings
- checkmark

```js
// Using custom play icon.
player.icons = { ...player.icons, play: '#play-svg-id' };
```

## Extending Language

You can add your own language via the `languages` prop.

```js
// Add the language.
player.languages = {
  ...player.languages,
  zh: {
    // From Google Translate.
    play: '播放视频',
    pause: '暂停影片',
    // ...
  }
};

// Change the locale.
player.locale = 'zh';
```

## Theming

You can style the player via the `theme` prop. Under the hood it utilizes [CSS custom properties][mdn-css-custom-props].

### CSS Vars

- color
- fontFamily
- fontSizeSmall
- fontSizeMedium
- fontSizeLarge
- fontSizeExtraLarge
- fontWeightLight
- fontWeightRegular
- fontWeighBold
- baseLineHeight

### Example

```js
// Apply a simple color theme.
player.theme = '#f76d82';

// Advanced theming.
player.theme = {
  color: '#f76d82',
  fontFamily: '"Helvetica Neue", "Segoe UI", Helvetica, Arial, sans-serif',
  fontSizeSmall: '14px',
  fontSizeMedium: '16px',
  fontSizeLarge: '18px',
  fontSizeExtraLarge: '21px',
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightBold: '500',
  baseLineHeight: '1.7'
}
```

[mdn-css-custom-props]: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
