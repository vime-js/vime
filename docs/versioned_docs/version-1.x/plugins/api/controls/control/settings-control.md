---
title: SettingsControl
sidebar_label: SettingsControl
---

**ID:** `vSettingsControl` | **LABEL:** `toggleSettings` | **Type:** [`Control`](./control-interface.md)

A control that toggles the visibility state of the settings menu.

## Relationships

If the [Settings](../../settings/settings.md) plugin is available then this control will automatically 
manage opening and closing it.

## Props

### `id`

**Type:** `string|null` | **Default:** `null`

The `id` of this control that is set on the underlying `<button>` element.

### `menuId`

**Type:** `string|null` | **Default:** `null`

The `id` of the menu that is tied to this control.

### `isEnabled`

**Type:** `boolean` | **Default:** `true`

Whether the control is rendered in the DOM or not.

### `isActive`

**Type:** `boolean` | **Default:** `false`

Whether the menu that is tied to this control is active or not.

## Methods

### `getControl`

**Return Type:** [`Control`](./control.md)

The underlying `Control` instance.

## Events

### Control

Forwards all `Control` [events](./control.md#events).