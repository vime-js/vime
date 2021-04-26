---
title: vm-control
sidebar_label: Control
---

A generic player control that is designed to work with both touch and mouse devices. It also
seamlessly works with `vime-tooltip`, which can be passed in via the default `slot`.

## Visual

<img
  src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control/control.png"
  alt="Vime control component"
/>

<!-- Auto Generated Below -->

## Usage

import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

<Tabs
groupId="framework"
defaultValue="html"
values={[
  { label: 'HTML', value: 'html' },
  { label: 'React', value: 'react' },
  { label: 'Vue 2', value: 'vue 2' },
  { label: 'Vue 3', value: 'vue 3' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Stencil', value: 'stencil' },
  { label: 'Angular', value: 'angular' }
]}>

<TabItem value="html">

```html {6-9}
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-controls full-width>
      <vm-control label="Playback" keys="k" pressed="false">
        <vm-icon name="play"></vm-icon>
        <vm-tooltip>Play (k)</vm-tooltip>
      </vm-control>
    </vm-controls>
  </vm-ui>
</vm-player>
```


</TabItem>

<TabItem value="react">

```tsx {3,24-33}
import React, { useMemo, useRef } from 'react';
import { Control, Icon, Tooltip, usePlayerContext } from '@vime/react';

function PlaybackControl() {
  const ref = useRef(null);
  const [paused, setPaused] = usePlayerContext(ref, 'paused', true);
  const [i18n] = usePlayerContext(ref, 'i18n', {});
  const icon = useMemo(() => (paused ? 'play' : 'pause'), [paused]);
  const tooltip = useMemo(() => (paused ? i18n.play : i18n.pause), [
    paused,
    i18n,
  ]);

  const onClick = () => {
    setPaused(false);
  };

  return (
    <Control
      keys="k"
      ref={ref}
      label={i18n.playback}
      pressed={paused}
      onClick={onClick}
    >
      <Icon name={icon} />
      <Tooltip>{tooltip} (k)</Tooltip>
    </Control>
  );
}
```


</TabItem>

<TabItem value="vue 2">

```html {2-10,16,24} title="playback-control.vue"
<template>
  <Control keys="k" :label="i18n.playback" :pressed="paused" @click="onClick">
    <Icon :name="icon" />
    <Tooltip>{{tooltip}} (k)</Tooltip>
  </Control>
</template>

<script>
  import {
    Mixin,
    Control,
    Icon,
    Tooltip,
  } from '@vime/vue';

  export default {
    mixins: [Mixin(['paused', 'i18n'])]
    components: {
      Control,
      Icon,
      Tooltip,
    },
    data: {
      paused: true,
      i18n: {},
    },
    computed: {
      icon() {
        return this.paused ? 'play' : 'pause';
      },
      tooltip() {
        return this.paused ? this.i18n.play : this.i18n.pause;
      },
    },
    methods: {
      onClick() {
        this.paused = !this.paused;
      },
    },
  };,
</script>
```


</TabItem>

<TabItem value="vue 3">

```html {2-10,19,27} title="playback-control.vue"
<template>
  <div ref="domRef">
    <Control keys="k" :label="i18n.playback" :pressed="paused" @click="onClick">
      <Icon :name="icon" />
      <Tooltip>{{tooltip}} (k)</Tooltip>
    </Control>
  </div>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue';
  import { usePlayerContext, Control, Icon, Tooltip } from '@vime/vue-next';

  export default defineComponent({
    name: 'PlaybackControl',
    components: {
      Control,
      Icon,
      Tooltip,
    },
    setup() {
      const domRef = ref(null);

      const paused = usePlayerContext(domRef, 'paused', true);
      const i18n = usePlayerContext(domRef, 'i18n', {});

      const icon = computed(() => (paused.value ? 'play' : 'pause'));
      const tooltip = computed(() =>
        paused.value ? i18n.value.play : i18n.value.pause,
      );

      return { domRef, paused, i18n, icon, tooltip };
    },
    methods: {
      onClick() {
        this.paused = !this.paused;
      },
    },
  });
</script>
```


</TabItem>

<TabItem value="svelte">

```tsx
<Control
  keys="k"
  label={$i18n.playback}
  pressed={paused}
  on:click={onClick}
  bind:this={ref}
>
  <Icon name={icon} />
  <Tooltip>{tooltip} (k)</Tooltip>
</Control>
```

```html {4}
<script lang="ts">
  import { usePlayerStore, Control, Icon, Tooltip } from '@vime/svelte';

  let ref: Control;

  const { paused, i18n } = usePlayerStore(() => ref);

  const onClick = () => {
    $paused = !$paused;
  };

  $: icon = $paused ? 'play' : 'pause';
  $: tooltip = $paused ? $i18n.play : $i18n.pause;
</script>
```


</TabItem>

<TabItem value="stencil">

```tsx {35-45}
import { h, Component, Prop } from '@stencil/core';
import {
  Dispatcher,
  createDispatcher,
  PlayerProps,
  withPlayerContext,
} from '@vime/core';

@Component({
  tag: 'playback-control',
})
export class PlaybackControl {
  private dispatch!: Dispatcher;

  /** @internal */
  @Prop() paused: PlayerProps['paused'] = true;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    return (
      <vm-control
        keys="k"
        label={this.i18n.playback}
        pressed={this.paused}
        onClick={this.onClick.bind(this)}
      >
        <vm-icon name={this.paused ? 'play' : 'pause'} />
        <vm-tooltip>
          {this.paused ? this.i18n.play : this.i18n.pause} (k)
        </vm-tooltip>
      </vm-control>
    );
  }
}

withPlayerContext(PlaybackControl, ['paused', 'i18n']);
```


</TabItem>

<TabItem value="angular">

```html title="playback-control.html"
<vm-control
  keys="k"
  [label]="i18n.playback"
  [pressed]="paused"
  (click)="onClick()"
>
  <vm-icon [name]="icon"></vm-icon>
  <vm-tooltip>{{tooltip}} (k)</vm-tooltip>
</vm-control>
```

```ts title="playback-control.ts"
import { Component, ElementRef } from '@angular/core';
import { Component } from '@vime/angular';

@Component({
  selector: 'playback-control',
  templateUrl: './playback-control.html',
})
class PlaybackControl extends Component {
  paused = true;

  i18n = {};

  constructor(protected ref: ElementRef) {
    super(['paused', 'i18n']);
  }

  get icon() {
    return this.paused ? 'play' : 'pause';
  }

  get tooltip() {
    return this.paused ? this.i18n.play : this.i18n.pause;
  }

  onClick() {
    this.paused = !this.paused;
  }
}
```


</TabItem>
</Tabs>


## Properties

| Property             | Description                                                                                                                                                   | Type                  | Default     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `expanded`           | If the control has a popup menu, this indicates whether the menu is open or not. Sets the `aria-expanded` property.                                           | `boolean ∣ undefined` | `undefined` |
| `hidden`             | Whether the control should be displayed or not.                                                                                                               | `boolean`             | `false`     |
| `identifier`         | The `id` attribute of the control.                                                                                                                            | `string ∣ undefined`  | `undefined` |
| `keys`               | A slash (`/`) separated string of JS keyboard keys (`KeyboardEvent.key`), that when caught in a `keydown` event, will trigger a `click` event on the control. | `string ∣ undefined`  | `undefined` |
| `label` _(required)_ | The `aria-label` property of the control.                                                                                                                     | `string`              | `undefined` |
| `menu`               | If the control has a popup menu, then this should be the `id` of said menu. Sets the `aria-controls` property.                                                | `string ∣ undefined`  | `undefined` |
| `pressed`            | If the control is a toggle, this indicated whether the control is in a "pressed" state or not. Sets the `aria-pressed` property.                              | `boolean ∣ undefined` | `undefined` |


## Methods

| Method         | Description                     | Signature                         |
| -------------- | ------------------------------- | --------------------------------- |
| `blurControl`  | Removes focus from the control. | `blurControl() => Promise<void>`  |
| `focusControl` | Focuses the control.            | `focusControl() => Promise<void>` |


## Events

| Event                 | Description                                                                                    | Type                   |
| --------------------- | ---------------------------------------------------------------------------------------------- | ---------------------- |
| `vmBlur`              | Emitted when the control loses focus.                                                          | `CustomEvent<void>`    |
| `vmFocus`             | Emitted when the control receives focus.                                                       | `CustomEvent<void>`    |
| `vmInteractionChange` | Emitted when the user is interacting with the control by focusing, touching or hovering on it. | `CustomEvent<boolean>` |


## Slots

| Slot | Description                                                     |
| ---- | --------------------------------------------------------------- |
|      | Used to pass in the content of the control (text/icon/tooltip). |


## CSS Custom Properties

| Name                         | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `--vm-control-bg`            | The background of the control.                                             |
| `--vm-control-border`        | The border of the control.                                                 |
| `--vm-control-border-radius` | The border radius of the control.                                          |
| `--vm-control-color`         | The text color of the control.                                             |
| `--vm-control-focus-bg`      | The background colour of a control when it is being hovered on or focused. |
| `--vm-control-focus-color`   | The text colour of a control when it is being hovered on or focused.       |
| `--vm-control-icon-size`     | The size of the icon in pixels.                                            |
| `--vm-control-padding`       | The padding inside the control.                                            |
| `--vm-control-scale`         | The amount to scale the control up/down by.                                |
| `--vm-control-tap-highlight` | The highlight color when a control is tapped.                              |


## Dependencies

### Used by

 - [vm-caption-control](./caption-control)
 - [vm-fullscreen-control](./fullscreen-control)
 - [vm-mute-control](./mute-control)
 - [vm-pip-control](./pip-control)
 - [vm-playback-control](./playback-control)
 - [vm-settings-control](./settings-control)


