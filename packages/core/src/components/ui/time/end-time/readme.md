# vime-end-time

Formats and displays the duration of the current media.

## Example

```html {5}
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-end-time></vime-end-time>
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

- [vime-default-controls](../../controls/default-controls)
- [vime-time-progress](../time-progress)

### Depends on

- [vime-time](../time)

### Graph

```mermaid
graph TD;
  vime-end-time --> vime-time
  vime-default-controls --> vime-end-time
  vime-time-progress --> vime-end-time
  style vime-end-time fill:#f9f,stroke:#333,stroke-width:4px
```

---

_Built with [StencilJS](https://stenciljs.com/)_
