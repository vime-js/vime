---
title: vime-poster
sidebar_label: Poster
slug: api
---

Loads the poster set in the player prop `currentPoster` and displays it. The poster will automatically
dissapear once playback starts.

## Example

```html {4}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <vime-poster></vime-poster>
  </vime-ui>
</vime-player>
```

<!-- Auto Generated Below -->

## Properties

| Property | Attribute | Description                                                                                   | Type                                                               | Default   |
| -------- | --------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------- |
| `fit`    | `fit`     | How the poster image should be resized to fit the container (sets the `object-fit` property). | `"contain" ∣ "cover" ∣ "fill" ∣ "none" ∣ "scale-down" ∣ undefined` | `'cover'` |

## Events

| Event       | Description                             | Type                |
| ----------- | --------------------------------------- | ------------------- |
| `vLoaded`   | Emitted when the poster has loaded.     | `CustomEvent<void>` |
| `vWillHide` | Emitted when the poster will be hidden. | `CustomEvent<void>` |
| `vWillShow` | Emitted when the poster will be shown.  | `CustomEvent<void>` |

## Dependencies

### Used by

- [vime-default-ui](../default-ui/readme.md)

### Graph

```mermaid
graph TD;
  vime-default-ui --> vime-poster
  style vime-poster fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
