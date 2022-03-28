---
title: Styling
sidebar_label: Styling
---

Vime uses [CSS custom properties][mdn-css-props] to style the player. If you're unfamiliar with
them then no worries, it's really easy to understand and there are awesome articles online to get
you up to speed:

- [MDN - Using CSS Custom Properties][mdn-css-props]
- [Smashing Magazine - It's Time to Start Using CSS Custom Properties][smashing-css-props]
- [W3C - CSS Custom Properties][w3c-css-props]

[mdn-css-props]: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
[smashing-css-props]: https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties
[w3c-css-props]: https://www.w3.org/TR/css-variables-1

## Theming

Vime comes with a light and dark theme out of the box (see the [installation](./installation)
page for how to load them). We can use it as a starting point when styling the player. You can switch
between light/dark by using the `theme` player property...

```html title="player.html"
<!-- Default is 'dark'. -->
<vm-player theme="light">
  <!-- ... -->
</vm-player>
```

One of the easiest ways to personalize the player to our brand or preference is by
setting the `vm-player-theme` CSS property, which will add a splash of color throughout the player...

```css title="player-theme.css"
vm-player {
  --vm-player-theme: #de4269;
}
```

What if we want to do more? We can see the [default theme][default-theme] file which has documented all
CSS properties used throughout Vime, and start replacing all the properties we want to change. Remember
if you apply it at the player level like we did with `vm-player-theme` above, it'll apply to all components
that accept that property.

**Global**

The following will apply to all controls in the player...

```css
vm-player {
  --vm-control-scale: 1.75;
}
```

**Instance**

The following will only apply to this specific control...

```html
<vm-control style="--vm-control-scale: 1.75;">
  <!-- ... -->
</vm-control>
```

Another way you can find out what CSS properties can be used to style a specific component is
by finding that component in the `Components` section in the sidebar (on your left), and scrolling
down to `CSS Properties`. In addition, sometimes a component is composed of other components, so if
you scroll down to `Dependencies > Depends On`, the CSS properties of those listed components
will be available as well.

Here are some additional selectors you can add to your styling toolkit:

```css title="player-theme.css"
vm-player[idle] {
  /* Add styles here for when the player is idle. */
}

vm-player[mobile] {
  /* Add styles here for when the player is loaded on a mobile device. */
}

vm-player[touch] {
  /* Add styles here for when the player is used on a touch device. */
}

vm-player[live] {
  /* Add styles here for when the media is a live stream. */
}

vm-player[audio] {
  /* Add styles here for when the media is of type `audio`. */
}

vm-player[video] {
  /* Add styles here for when the media is of type `video`. */
}

vm-player[pip] {
  /* Add styles here for when the player is in picture-in-picture mode. */
}

vm-player[fullscreen] {
  /* Add styles here for when the player is in fullscreen mode. */
}

/* You can replace 'light' with 'dark' or any custom theme name you'd like. */
vm-player[theme='light'] {
  /* Add styles here for when the theme is set to `light`.  */
}
```

[default-theme]: https://github.com/vime-js/vime/blob/main/packages/core/src/themes/default.css

## Icons

Vime comes with two icon libraries out of the box (`vime` or `material`), and you can easily
load your own via the [IconLibrary](../components/ui/icon-library) component (refer to the
documentation on how to do so).

After the icons have been registered, you can use them globally by setting the
`icons` property on the [Player](../components/core/player) component, or you can change
them on a component-by-component basis as long as there are properties to do so. Most controls support
changing their icons, for example the [PlaybackControl](../components/ui/controls/playback-control)
has properties for changing the `playIcon`, `pauseIcon` and the library via `icons`.

### Naming

If you're looking to replace all the player icons with your own then you should use
the following naming guide to ensure all components are pointing to the correct icon, so you
don't have to go around and change them individually.

**Use the following names for your SVG files and place them inside the same folder:**

- `play`
- `pause`
- `check`
- `captions-on`
- `captions-off`
- `fast-forward`
- `rewind`
- `fullscreen-enter`
- `fullscreen-exit`
- `pip-enter`
- `pip-exit`
- `settings`
- `volume-high`
- `volume-low`
- `volume-mute`
