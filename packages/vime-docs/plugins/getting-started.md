# Getting Started

Plugins are at the heart of Vime because everything outside of the core is built as one. Basically plugins
are Svelte components that implement the [plugin interface](../complete/api/plugin.md) and 
add some functionality/feature to the player. Plugins can be interacted with through the props,
methods and events they expose.

## Installing Plugins

### Quick

You can get started quickly by simply using the [`Boot`](./api/boot.md) plugin which will install all Vime plugins. It 
also provides the option of turning off plugins you don't need, see the [`Boot`](api/boot.md) plugin page
for more information.

### Modular

If you want more control then you can pick and use only what you need.

{% tabs %}
{% tab title="JavaScript" %}
```js
import { 
  Player, ActionDisplay, Keyboard, 
  Tooltips 
} from '@vime-js/complete';

const target = document.getElementById('player-target');

const player = new Player({ 
  target,
  props: {
    plugins: [ActionDisplay, Keyboard, Tooltips]
  }
});
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  {plugins}
  bind:this={player} 
/>

<script>
  import { 
    Player, ActionDisplay, Keyboard, 
    Tooltips 
  } from '@vime-js/complete';

  let player;

  const plugins = [ActionDisplay, Keyboard, Tooltip];
</script>
```
{% endtab %}
{% endtabs %}

### Dynamic

If you want to dynamically add/remove plugins you can use the [`PluginsManager`](../complete/api/plugins-manager.md).

{% tabs %}
{% tab title="JavaScript" %}
```js
import { ActionDisplay, Keyboard, Tooltips } from '@vime-js/complete';

// ...

const pluginsManager = player.getPluginsManager();

pluginsManager
  .addPlugins([ActionDisplay, Keyboard, Tooltips])
  .then([actionDisplay, keyboard, tooltips] => {
    // ...
  });

// ...

pluginsManager
  .removePlugin(Keyboard)
  .then(() => {
    // ...
  });
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  on:mount={onPlayerMount}
  bind:this={player} 
/>

<script>
  import { 
    Player, ActionDisplay, Keyboard, 
    Tooltips 
  } from '@vime-js/complete';

  let player;

  const onPlayerMount = async () => {
    const pluginsManager = player.getPluginsManager(); 

    const [
      actionDisplay,
      keyboard,
      tooltips,
    ] = await pluginsManager.addPlugins([ActionDisplay, Keyboard, Tooltips]);

    // ...

    await pluginsManager.removePlugin(Keyboard);

    // ...
  };
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
You can still do this with the `plugins` prop, but the manager has a much better interface for this.
{% endhint %}

## Interacting with Plugins

All Vime plugins are attached to the player and can be accessed via their plugin `ID`.  All Vime plugins 
follow the naming convention of `v{PluginName}`. 

- Keyboard = `vKeyboard`
- ActionDisplay = `vActionDisplay`
- Controls = `vControls`

### Simple Example

{% tabs %}
{% tab title="JavaScript" %}
```js
// ...

player.$on('mount', () => {
  player.vKeyboard.doSomething();
});
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  {plugins}
  on:mount={onPlayerMount}
  bind:this={player}
/>

<script>
  import { Player, Keyboard } from '@vime-js/complete';

  let player;

  const plugins = [Keyboard];

  const onPlayerMount = () => {
    player.vKeyboard.doSomething();
  };
</script>
```
{% endtab %}
{% endtabs %}

### Advanced Example

{% tabs %}
{% tab title="JavaScript" %}
```js
import { PlayerEvent, Keyboard } from '@vime-js/complete';

// ...

player.$on(PlayerEvent.PLUGIN_MOUNT, e => {
  const { id, plugin } = e.detail;
  
  if (id === Keyboard.ID) { 
    // Keyboard plugin mounted.
  }
});

player.$on(PlayerEvent.PLUGIN_DESTROY, e => {
  const id = e.detail;
  
  if (id === Keyboard.ID) {
    // Keyboard plugin destroyed.
  }
});
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  {plugins}
  on:mount={onPlayerMount}
  bind:this={player}
/>

<script>
  import { Player, Keyboard } from '@vime-js/complete';

  let player;
  let registry;

  const plugins = [Keyboard];

  const onPlayerMount = () => {
    registry = player.getPluginsRegistry();
  };

  /**
   * Because the registry has a subscribe method, we can 
   * take advantage of auto-subscriptions.
   **/
  $: keyboardPlugin = $registry && $registry[Keyboard.ID];

  $: if (keyboardPlugin) {
    // ...
  }
</script>
```
{% endtab %}
{% endtabs %}
