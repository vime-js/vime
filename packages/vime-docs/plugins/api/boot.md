# Boot

**ID:** `vBoot` | **Type:** [`Plugin`](../../complete/api/plugin.md)

[View Source](../../../vime-complete/src/plugins/Boot.svelte)

This plugin installs the following plugins:

- [Icons](icons.md)
- [Poster](poster.md)
- [Scrim](scrim.md)
- [Spinner](spinner.md)
- [Captions](captions.md)
- [Controls](controls/controls.md)
- [Settings](settings/settings.md)
- [ActionDisplay](action-display.md)
- [Tooltips](tooltips/tooltips.md)
- [Keyboard](keyboard/keyboard.md)
- [ClickToPlay](click-to-play.md)
- [DblClickFullscreen](dbl-click-fullscreen.md)

## Setup

{% tabs %}
{% tab title="Basic" %}
```js
import { Player, Boot } from '@vime-js/complete';

// ...

const player = new Player({
  target,
  props: {
    plugins: [Boot]
  }
});
```
{% endtab %}

{% tab title="Manager" %}
```js
import { Player, Boot } from '@vime-js/complete';

// ...

player
  .getPluginsManager()
  .addPlugin(Boot)
  .then((boot) => {
    // ...
  });
```
{% endtab %}
{% endtabs %}

## Props

### `manifest`

**Type:** `{ [id]: boolean }` | **Default:** All plugins default to `true`.

The manifest determines which plugins should be installed. All plugins are identified by
their `ID` with the `v` prefix removed and first letter lowercased.

- `vControls` = `controls`
- `vActionDisplay` = `actionDisplay`
- `vClickToPlay` = `clickToPlay`

{% tabs %}
{% tab title="JavaScript" %}
```js
import { Player, Boot } from '@vime-js/complete';

const target = document.getElementById('player-target');

const player = new Player({
  target,
  props: {
    plugins: [Boot]
  }
});

const off = player.$on('mount', () => {
  player.vBoot.manifest = {
    controls: false,
    actionDisplay: false,
    clickToPlay: false
  };
});
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  plugins={[Boot]}
  on:mount={onPlayerMount}
  bind:this={player} 
/>

<script>
  import { Player, Boot } from '@vime-js/complete';

  let player;

  const onPlayerMount = () => {
    player.vBoot.manifest = {
      controls: false,
      actionDisplay: false,
      clickToPlay: false
    };
  };
</script>
```
{% endtab %}
{% endtabs %}
