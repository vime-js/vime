# Settings

**ID:** `vSettings` | **ROLE:** `SETTINGS` | **Type:** [`Plugin`](../../../complete/api/plugin.md)

[View Source](../../../../vime-player/src/plugins/settings/Settings.svelte)

This plugin renders and manages submenus. The root menu is a small popup on desktop, and a fullscreen modal on mobile.

{% hint style="info" %}
This plugin has a [`Registry`](../../../complete/api/registry.md) containing all registered
submenus.

```js
const unsubscribe = player.getRegistry().subscribe(records => {
  const submenus = records.vSettings;
});

// ...

unsubscribe();
```
{% endhint %}

## Defaults

By default there are no submenus, but you can install an additional `DefaultSettings` plugin to
get started with the Vime defaults. The default Vime settings includes submenus for setting the 
playback rate, video quality and captions/subtitles.

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Settings, DefaultSettings } from '@vime-js/player';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Settings, DefaultSettings]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Settings, DefaultSettings } from '@vime-js/player';

// ...

player
  .getPluginsManager()
  .addPlugins([Settings, DefaultSettings])
  .then(([settings]) => {
    // ...
  });
```
{% endtab %}
{% endtabs %}

## Usage

### Create a Submenu

```js
import { SelectSubmenu } from '@vime-js/player';

player
  .vSettings
  .createSubmenu('playbackRateMenu', SelectSubmenu)
  .then(submenu => {
    const options = player.playbackRates.map((rate) => ({
      title: (rate === 1) ? player.i18n.normal : rate,
      value: rate,
    }));

    /**
     * $set is part of the Svelte component API, you can 
     * individually set these props as well.
     **/
    submenu.$set({
      title: player.i18n.speed,
      value: player.playbackRate,
      options: (player.playbackRates.length === 1) ? [] : options,
      emptyHint: player.i18n.normal,
      isLocked: !player.canSetPlaybackRate || (player.playbackRates.length === 0),
    });

    submenu.$on('valuechange', e => {
      player.playbackRate = e.detail;
    });
  });
```

{% hint style="info" %}
See [`SelectSubmenu`](./menu/submenu/select-submenu.md) for the full API.
{% endhint %}

### Update a Submenu

```js
const submenu = player.vSettings.getSubmenu('playbackRateMenu');
const { playbackRate } = player.getStore();

playbackRate.subscribe(rate => {
  submenu.value = rate;
});

// ...
```

### Remove a Submenu

```js
player
  .vSettings
  .removeSubmenu('playbackRateMenu')
  .then(() => {
    // ...
  });
```

### Access Submenu via Event

```js
player.vSettings.$on('register', registration => {
  const { id, value: submenu } = registration;

  if (id === 'playbackRateMenu') {
    // ...
  }
});
```

### Access Submenu via Registry

```js
player.vSettings.getRegistry().subscribe(menus => {
  const submenu = menus.playbackRateMenu;

  if (submenu) {
    // ...
  }
});
```

## Store

All properties for this plugin are backed by a Svelte store which you can access via the `getStore`
method.

```js
const { isMenuActive } = player.vSettings.getStore();
```

## Props

### `isMenuActive`

**Type:** `boolean` | **Default:** `false`

Whether the root settings menu is visible or not.

### `currentSubmenu`

**Type:** `string|null` | **Default:** `null`

The `id` of the currently active submenu.  If it is `null` then no submenu is active.

## Methods

### `getRegistry`

**Return Type:** [`Registry`](../../../complete/api/registry.md)

The plugin registry where submenu instances are registered.

### `getStore`

**Return Type:** `object`

See the [store](#store) section above.

### `getEl`

**Return Type:** `HTMLElement`

The root component HTML element.

### `getId`

**Return Type:** `string`

An auto-generated id for the root menu element in the form `settings-{count}`. This is to distinguish
between multiple player menus on the same page.

### `getControllerId`

**Return Type:** `string`

An auto-generated id for the root menu controller in the form `settings-control-{count}`.

### `getMenu`

**Return Type:** [`Menu`](./menu/menu.md)

The underlying `Menu` instance.

### `getSubmenus`

**Return Type:** `Submenu[]`

The rendered submenu instances.

### `getSubmenu`

**Parameters:** `(id: string)` | **Return Type:** `Submenu|undefined`

The rendered submenu instance for the given `id`.

### `createSubmenu`

**Parameters:** `(id: string, type: Component = Submenu)` | **Return Type:** `Promise<Submenu>`

Creates and renders a `Submenu` component and returns a `Promise` that will resolve with the 
rendered instance. The `type` field can be used to pass in a component that extends the base `Submenu`.

### `createSubmenus`

**Parameters:** `(ids: string[], type: Component = Submenu)` | **Return Type:** `Promise<Submenu[]>`

Creates and renders a list of `Submenu` components and returns all their instances via a `Promise`.
The `type` field can be used to pass in a component that extends the base `Submenu`.

### `removeSubmenu`

**Parameters:** `(id: string)` | **Return Type:** `Promise<undefined>`

Destroys a `Submenu` instance matching the given `id` and returns a `Promise` that will resolve
once it has completed.

### `removeSubmenus`

**Parameters:** `(ids: string[])` | **Return Type:** `Promise<undefined>`

Destroys multiple `Submenu` instances matching the given `ids` and returns a `Promise` that will
resolve once it has completed.

## Events

### Registry

Emits `Registry` [events](../../../complete/api/registry.md#events).

### `open`

**Data Type:** `undefined`

Fired when the root menu becomes visible.

### `close`

**Data Type:** `undefined`

Fired when the root menu becomes hidden.

### `opensubmenu`

**Data Type:** `string`

Fired with the id of the submenu that's visible.

### `closesubmenu`

**Data Type:** `string`

Fired with the id of the submenu that's hidden.



