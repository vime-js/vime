# Player

**Type:** `Component`

[View Source](../../../vime-complete/src/core/CompletePlayer.svelte)

This component extends the Standard Player and exposes its [API](../../standard/api/player.md) so it can be 
accessed directly from this component. 

**Standard Player API Differences**

- `useNativeView`, `useNativeControls` and `useNativeCaptions` default to `false`.
- `canSetPoster`, `canSetTracks` and `canSetTrack` now check for both plugin and provider support.

## Store

All props below are powered behind the scenes by a [store][svelte-store]. They are plain JS objects that 
contain a `subscribe` function and an optional `set` function. You can subscribe to receive updates 
of some value as it changes over time. The `subscribe` function returns an `unsubscribe` function that 
you can call to stop listening.

[svelte-store]: https://svelte.dev/docs#svelte_store

{% hint style="info" %}
In addition to the props listed below, all props listed in the [Standard Player API](../../standard/api/player.md#props), 
are also available via `getStore`.
{% endhint %}

### Usage

```js
// All props below are available here.
const { paused } = player.getStore();

const unsubscribe = paused.subscribe(isPaused => {
  console.log('paused state changed to:', isPaused);
});

// ...

unsubscribe();
```

## Props

### `locale`

**Type:** `string` | **Default:** `en`

Determines the current language preference.

### `languages`

**Type:** `{ [localeId]: { [id]: string } }` | **Default:** `{ en }`

Translation maps that the player uses when the `locale` changes.

{% hint style="info" %}
See the [english map](../../../vime-complete/src/lang/en.js).
{% endhint %}

### `i18n`

**Type:** `{ [id]: string }` | **Default:** [english map](../../../vime-complete/src/lang/en.js)

Contains the current language map. It's basically `languages[locale]` under the hood. If the current 
`locale` has no language map, it'll fallback to `en`.

### `icons`

**Type:** `{ [id]: string }` | **Default:** `{}`

Icons are expected to be loaded as an SVG sprite that is inserted into the 
head of the document. The `icons` prop is a collection of icon identifiers and the value
of the corresponding SVG elements `id` attribute.

### `theme`

**Type:** `string|object|null` | **Default:** `null`

Used to style the player, under the hood it uses CSS custom properties. It can be a `string`
to set the primary color of the player, or an `object` that contains a collection of 
[available CSS vars](../usage.md#css-vars) and their corresponding values.

### `class`

**Type:** `string` | **Default:** `null`

CSS classes to be applied to the root player element.

### `plugins`

**Type:** `Plugin[]` | **Default:** `[]`

The current list of plugins that the player has installed.

### `debug`

**Type:** `boolean` | **Default:** `false`

Whether the player is in debug mode or not. If `true`, messages are sent to the console.

### `isMobile`

**Type:** `boolean` | **Default:** `false`

Whether the player is in mobile mode or not. This is `true` if the device is determined to be a 
mobile device via the User-Agent.

### `isTouch`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether the user is currently using touch input. This is actively updated by listening to the `touchstart` 
and `mousemove` events.

### `isContextMenuEnabled`

**Type:** `boolean` | **Default:** `false`

Whether the context menu (right click on player) can be opened or not. In development mode this is 
enabled regardless of what value this is set to.

### `currentPoster`

**Type:** `string|null` | **Default:** `null` | **Readonly:** `true`

The current poster, either a custom poster or the native one if available.

### `hasControls`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether there are controls available via a plugin, or the native controls are being used.

### `hasCaptions`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether there are captions available via a plugin, or the native captions are being used.

### `hasSettings`

**Type:** `boolean` | **Default:** `false` | **Readonly:** `true`

Whether settings are available via a plugin, or the native controls are being used and have
settings available.

## Methods

### `getEl`

**Return Type:** `HTMLElement`

The root player element.

### `getRegistry`

**Return Type:** [`Registry`](./registry.md)

The root player registry.

### `getStandardPlayer`

**Return Type:** [`StandardPlayer`](standard/../../../standard/api/player.md)

The underlying `StandardPlayer` instance.

### `getPluginsManager`

**Return Type:** [`PluginsManager`](./plugins-manager.md)

The core `PluginsManager`.

### `getPluginsRegistry`

**Return Type:** [`Registry`](./registry.md)

The `Registry` owned by the `PluginsManager`. 

{% hint style="info" %}
Alternative to `player.getPluginsManager().getRegistry()`.
{% endhint %}

### `dispose`

**Parameters:** `(cb: () => void)`

Calls the provided cleanup `function` when the player is being destroyed.

### `createRegistry`

**Parameters:** `(id: string)` | **Return Type:** [`Registry`](./registry.md)

Creates a new `Registry`, registers it with the root player registry and returns it. This method 
is generally used by plugins.

### `createLogger`

**Parameters:** `(id: string)` | **Return Type:** `{ log: fn, warn: fn, error: fn }`

Returns an object with functions that format and forward messages to the respective `console` method. 
This method is generally used by plugins.

## Events

{% hint style="info" %}
Vime only has some basic events below because updates can be received via stores. whether it's `currentTime` changes, 
fullscreen changes, or for any player state change we subscribe to the respective [store](#store).
{% endhint %}

```js
// Start listening.
const off = player.$on("someEvent", e => {
  const data = e.detail;
});

// Stop listening.
off();
```

### `mount`

**Data Type:** `undefined`

Fired when the player has mounted the DOM and the initial list of plugins have been installed.

### `destroy`

**Data Type:** `undefined`

Fired when the player is removed from the DOM.

### `pluginmount`

**Data Type:** `{ id: string, plugin: Component }`

Fired when a plugin has mounted the DOM and attached to the player.

### `plugindestroy`

**Data Type:** `string` (The `id` of the destroyed plugin)

Fired when a plugin has been destroyed, removed from the DOM and deattached from the player.

### `error`

**Data Type:** `any`

Emits provider and plugin errors.