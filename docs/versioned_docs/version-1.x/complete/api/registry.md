---
title: Registry
sidebar_label: Registry
---

**Type:** `class`

The `Registry` class represents a collection of `id` and `value` pairs known as records. Each `id` is a `string`
that identifies a `value` (which can be anything, including another `Registry` which we then call a subregistry).
Each `id` is unique so it can only be registered once, unless it is deregistered and registered again.

:::info
- Registries are an integral part of the Vime plugin system.
- If a registry is created within a Plugin (aka Svelte component), it will automatically destroy itself when the component does.
- If a registered value is a Svelte component, it will automatically be deregistered when the component is destroyed.
:::

## Setup

**Constructor:** `new Registry(id: string, validator: ((id: string, value: any) => boolean)?)`

```js
import { Registry } from "@vime-js/complete";

const id = "myRegistry";

/**
 * Values are not registered if they fail validation. This 
 * should log a message so developers are aware of why a 
 * particular registration failed.
 **/
const optionalValidator = (id, value) => true;

const registry = new Registry(id, optionalValidator);

// ...

// No need to call this if we are inside a Plugin (aka Svelte component).
registry.destroy();
```

## Store

A registry is powered by a [store][svelte-store]. Thus, you can subscribe to the `Registry` and 
be updated of any changes to its records.

```js
const registry = new Registry('myRegistry');

registry.subscribe(records => {
  console.log(records);
});
```

[svelte-store]: https://svelte.dev/docs#svelte_store

## Methods

### `getId`

**Return Type:** `string`

The `id` the registry was created with.

### `getName`

**Return Type:** `string`

The name of the registry, which is simply `{id}Registry`. This is used for logging errors.

### `getRegistrations`

**Return Type:** `string[]`

A list of all registered id's.

### `getValue`

**Parameters:** `(id: string)` | **Return Type:** `string[]`

Gets the currently registered value for the given `id`.

### `getValues`

**Return Type:** `any[]`

A list of all registered values.

### `has`

**Parameters:** `(id: string)` | **Return Type:** `boolean`

Checks whether any value is registered to the given `id`.

### `invalidate`

Notifies the registry to send a new copy of it's records to subscribers. Bubbles up to parent registries.

### `register`

**Parameters:** `(id: string, value: any)`

Registers a value under the given `id`. This method throws if there is no id or if it is taken.

### `deregister`

**Parameters:** `(id: string)`

Deregisters the given `id` and removes its corresponding value.

### `subscribe`

**Return Type:** `ReadonlyStore<object>`

A readonly store that emits updated copies of all records. All subregistries are unwrapped to return their records.

### `destroy`

Deregisters all registrations, and if it is a subregistry it deregisters itself from its parent.

## Events

Events are only emitted if the registry is created within a Plugin (aka Svelte component). The event
is emitted using the components event dispatcher.

### `register`

**Data Type:** `{ id: string, value: any }`

Fires on new registrations.

### `deregister`

**Data Type:** `string` (The `id` of the deregistered value)

Fires on deregistrations.