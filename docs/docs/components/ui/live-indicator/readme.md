---
title: vime-live-indicator
sidebar_label: LiveIndicator
slug: api
---

This can be used to indicate to the user that the current media is being streamed live.

## Example

```html {7}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-controls>
      <!-- ... -->
      <vime-live-indicator></vime-live-indicator>
    </vime-controls>
  </vime-ui>
</vime-player>
```

<!-- Auto Generated Below -->

## CSS Custom Properties

| Name                     | Description                          |
| ------------------------ | ------------------------------------ |
| `--live-indicator-color` | The color of the live indicator dot. |

## Dependencies

### Used by

- [vime-default-controls](../controls/default-controls/readme.md)

### Graph

```mermaid
graph TD;
  vime-default-controls --> vime-live-indicator
  style vime-live-indicator fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
