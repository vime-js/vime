---
title: Keyboard
sidebar_label: Keyboard
---

**ID:** `vKeyboard` | **Type:** [`Plugin`](../../../complete/api/plugin.md)

This plugin manages [keyboard shortcuts](./keyboard-shortcut.md).

:::info
This plugin has a [`Registry`](../../../complete/api/registry.md) containing all registered
keyboard shortcuts.

```js
const unsubscribe = player.getRegistry().subscribe(records => {
  const shortcuts = records.vKeyboard;
});

// ...

unsubscribe();
```
:::

## Defaults

By default there are no shortcuts, but you can install an additional `DefaultKeyboard` plugin to get 
started with the Vime defaults.

- `togglePlayback`: `space/k` to toggle playback.
- `adjustVolume`: `up arrow` and `down arrow` to control the volume level.
- `seek`: `left arrow` and `right arrow` to seek forward/backward.
- `toggleMute`: `m` to toggle the muted state of the player.
- `toggleCaptions`: `c` to toggle captions on/off.
- `togglePiP`: `p` to toggle PiP on/off.
- `toggleFullscreen`: `f` to toggle fullscreen on/off.

## Setup

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
  groupId="plugins"
  defaultValue="basic"
  values={[
  { label: 'Basic', value: 'basic' },
  { label: 'Manager', value: 'advanced' },
]}>

<TabItem value="basic">

```js
import { Player, Keyboard, DefaultKeyboard } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Keyboard, DefaultKeyboard]
  }
});
```

</TabItem>

<TabItem value="advanced">

```js
import { Player, Keyboard, DefaultKeyboard } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugins([Keyboard, DefaultKeyboard])
  .then(([keyboard]) => {
    // ...
  });
```

</TabItem>

</Tabs>

## Usage

### Create Shortcut

```js
player.vKeyboard.addShortcut('togglePlayback', {
  hint: 'space/k',
  keys: [32, 75],
  action: () => {
    if (!player.canInteract) return;
    player.paused = !player.paused;
  }
});
```

### Update Shortcut

```js
player.vKeyboard.updateShortcut('togglePlayback', {
  hint: 'space',
  keys: [32]
});
```

### Delete Shortcut

```js
player.vKeyboard.removeShortcut('togglePlayback');
```

### Access Shortcut via Event

```js
player.vKeyboard.$on('register', registration => {
  const { id, value: shortcut } = registration;
  
  if (id === 'togglePlayback') {
    // ...
  }
});
```

### Access Shortcut via Registry

```js
player.vKeyboard.getRegistry().subscribe(shortcuts => {
  const shortcut = shortcuts.togglePlayback;
  
  if (shortcut) {
    // ...
  }
});
```

## Relationships

### ActionDisplay

If the [ActionDisplay](../action-display.md) plugin is available then all key presses will emit an 
icon/value in the middle of the player to display the action taken.

### Tooltips

If the [Tooltips](../tooltips/tooltips.md) plugin is available, then the `Keyboard` plugin will look 
for any registered `Tooltip` with a matching `id` to a keyboard shortcut, if found it will set the `hint` 
prop to the keyboard shortcut `hint`. For example, if a title is "play", it will become "play (space / k)".

## Props

### `autopilot`

**Type:** `boolean`  | **Default:** `true`

In autopilot mode the plugin will control certain properties automatically. Set this to `false` if you'd like to 
control them yourself. Properties below contain an 'Auto' descriptor if they are part of this system.

### `isEnabled`

**Type:** `boolean`  | **Default:** `true` | **Auto:** `true`

Whether the plugin is enabled or not.

## Methods

### `getRegistry`

**Return Type:** [`Registry`](../../../complete/api/registry.md)

The plugin registry where `KeyboardShortcut` objects are registered.

### `getShortcuts`

**Return Type:** `KeyboardShortcut[]`

All registered keyboard shortcuts.

### `getShortcut`

**Parameters:** `(id: string)` | **Return Type:** `KeyboardShortcut|undefined`

The keyboard shortcut object for the given `id`.

### `addShortcut`

**Parameters:** `(id: string, shortcut: KeyboardShortcut)`

Creates and regsiters a keyboard shortcut.

### `updateShortcut`

**Parameters:** `(id: string, shortcut: KeyboardShortcut)`

Updates the keyboard shortcut associated with the given `id`.

### `removeShortcut`

**Parameters:** `(id: string)`

Removes and deregisters the keyboard shortcut for the given `id`.

### `removeShortcuts`

**Parameters:** `(ids: string[])`

Removes and deregisters multiple keyboard shortcuts.

## Events

### Registry

Emits `Registry` [events](../../../complete/api/registry.md#events).
