# vime-faketube

Fake media provider that is used for testing.

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description                                                                         | Type      | Default |
| ------------- | --------- | ----------------------------------------------------------------------------------- | --------- | ------- |
| `autoplay`    | --        | **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component. | `boolean` | `false` |
| `controls`    | --        | **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component. | `boolean` | `false` |
| `debug`       | --        | **INTERNAL:** Do not interact with this prop, refer to `vime-player` component.     | `boolean` | `false` |
| `loop`        | --        | **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component. | `boolean` | `false` |
| `muted`       | --        | **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component. | `boolean` | `false` |
| `playsinline` | --        | **INTERNAL:** Do not interact with this prop, refer to the `vime-player` component. | `boolean` | `false` |


## Methods

### `dispatchStateChange(prop: PlayerProp, value: any) => Promise<void>`

Dispatches a state change event.

#### Returns

Type: `Promise<void>`



### `getAdapter() => Promise<MockMediaProviderAdapter>`

**INTERNAL:** Returns the adapter that each provider must implement, to enable the core player
component (`vime-player`) to control it. Do not interact with this method directly.

#### Returns

Type: `Promise<MockMediaProviderAdapter>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
