---
title: Release Notes
sidebar_label: Release Notes
---

These release notes contain what's new in Vime 5 and how you can migrate over from Vime 4.

## What's New?

This release focuses on consistency, performance improvements and refactoring internals to bring
some long awaited features.

- **Shadow DOM.** All components are now safely tucked away in the Shadow DOM, no more
  random styles breaking! In addition, all `class` and `style` attributes have been moved from
  the `<Host>` element to a container inside the component, this means you can safely apply your
  own styles to Vime components without messing up the internals.

- **New icon library system.** The icon system has been reworked to include additional icon sets,
  and it's now much easier to create your own. Vime now comes with `vime` and `material`
  icon sets out of the box, and there'll be more coming in the future! You can easily switch between
  icon sets and even change them on a component-by-component basis.

- **Provider switching.** Providers can now be changed dynamically, so one moment you can be using
  HLS and in the next whatever you like.

- **HLS/DASH audio tracks and video quality support.** There is now an API for getting/setting
  the audio tracks and playback qualities when using HLS/DASH. Not only that... but they are now
  automatically synced with the default Vime settings menu!

- **New captions interface.** Entirely new captions system that adds support for HLS/DASH. There
  are new properties/methods/events for text tracks, and the default Vime settings menu now
  supports captions loaded from a HLS/DASH manifest.

- **Dynamic mobile UI.** The mobile UI now uses `ResizeObserve` to dynamically change between
  mobile and desktop mode. If the player goes below `480px` it'll go into mobile mode, and any larger
  it'll jump back to desktop.

- **New loading screen.** A new loading screen component `vm-loading-screen` has been introduced
  to replace the old and dusty skeleton animation. You can now easily add your own logo or branding
  while the player is booting or media is loading.

- **Cleaner touch styling.** This is a small change but styling for touch devices uses rounded
  highlights to match your thumb instead of a square. There's also pressed feedback now, which is
  when your holding your thumb on an element such as a control.

- **Smoother settings UI.** The settings has been revamped with some new animations. It just feels
  a little nicer to use and less jumpy.

- **Naming is more consistent across the library.** The CSS variables were already using the prefix
  `vm` but the components were using `vime` such as `vime-video`, and events were using `v` such as
  `vPlay`. This is obviously silly so everything is `vm` now. Examples:
  `vm-video`, `--vm-player-font-family`, `vmPlay`.

- **Less naming pollution.** Framework integrations have been simplified by removing the `Vime` prefix
  from all components.

```ts
// Old.
import { VimePlayer, VimeVideo } from '@vime/react';

// New.
import { Player, Video } from '@vime/react';
```

- **Attributes over classes for styling.** Most components including the player were styled based
  on classes before such as `vime-player.mobile`, due to using the Shadow DOM and steering away
  from placing styles on the host element, all styles are applied via attributes now such
  as `vime-player[mobile]`.

## Migrating (v4 to v5)

- The largest change to take note of is that Vime now uses the Shadow DOM. If you were querying
  or manipulating elements inside the player, this won't be possible anymore.

- All component, event and CSS variables are prefixed now with `vm`. Components have gone from
  `vime-video` to `vm-video`, events from `vPlay` to `vmPlay`, and CSS variables remain the same as
  before `--vm-player-font-family`.

- Skeleton has been removed from the DefaultUi and with it the `noSkeleton` property. You can add
  this back manually yourself if you want it.

- The `attached` property and `vmAttached` event has been removed from the player component.

- The `vime-icons` component has been removed and replaced by `vm-icon-library`.

- The icons folder in the root `@vime/core` package has been moved. Icons are now kept in sets
  under the `icons` folder such as `icons/vime` and `icons/material`. If you were loading these
  files from the CDN for any reason then simply point to the new URL.

- Auto-generated ids now use the `vm` prefix instead of `vime`.

- The icon component accepts a `src` prop instead of a `href` prop.

- The `errors` property has been removed from the player, all errors are emitted from the `vmError` event instead
  of `vErrorsChange`.

- The `loadSprite` helper has been removed and is not exported from any package.
