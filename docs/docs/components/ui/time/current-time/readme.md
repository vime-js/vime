---
title: vime-current-time
sidebar_label: CurrentTime
slug: api
---

Formats and displays the current time of playback.

## Example

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-current-time></vime-current-time>
  </vime-ui>
</vime-player>
```

<!-- Auto Generated Below -->

## Properties

| Property          | Attribute           | Description                                                                                                           | Type      | Default |
| ----------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| `alwaysShowHours` | `always-show-hours` | Whether the time should always show the hours unit, even if the time is less than 1 hour (eg: `20:35` -> `00:20:35`). | `boolean` | `false` |

## Dependencies

### Used by

- [vime-default-controls](../../controls/default-controls/readme.md)
- [vime-time-progress](../time-progress/readme.md)

### Depends on

- [vime-time](../time/readme.md)

### Graph

```mermaid
graph TD;
  vime-current-time --> vime-time
  vime-default-controls --> vime-current-time
  vime-time-progress --> vime-current-time
  style vime-current-time fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
