# Setup

[![version-badge]][package]
[![size-badge]][size]
[![license-badge]][license]
[![github-badge]][github]
[![tweet-badge]][tweet]

The Complete Player is Vime's greatest offering. It enables complete customization of the player. If you'd like to 
know what features it includes and how it compares to other options then see the [getting started](../getting-started.md) page.

{% hint style="info" %}
If you want to try it out before installing then head over to our [playground][vime-playground].
{% endhint %}

[package]: https://www.npmjs.com/package/@vime-js/complete
[version-badge]: https://img.shields.io/npm/v/@vime-js/complete?style=flat-square
[size]: https://bundlephobia.com/result?p=@vime-js/complete
[size-badge]: https://img.shields.io/bundlephobia/minzip/@vime-js/complete?label=min%2Bgzip&style=flat-square
[license]: https://github.com/vime-js/vime/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/vime-js/vime?color=blue&style=flat-square
[tweet]: https://twitter.com/intent/tweet?text=Check%20out%20Vime%20%28https%3A%2F%2Fgithub.com%2Fvime-js%2Fvime%29%2C%20it%20makes%20embedding%20and%20using%20media%20players%20for%20the%20web%20simple.%20It%20supports%20Html5%2C%20YouTube%2C%20Dailymotion%2C%20Vimeo%20and%20more%20to%20come%21
[tweet-badge]: https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fvime-js%2Fvime
[github]: https://github.com/vime-js/vime
[github-badge]: https://img.shields.io/github/stars/vime-js/vime?style=social
[vime-playground]: https://playground.vime-js.com/?path=/story/complete

## Installation

{% tabs %}
{% tab title="NPM" %}
```
npm install @vime-js/complete
```
{% endtab %}

{% tab title="YARN" %}
```
yarn add @vime-js/complete
```
{% endtab %}

{% tab title="UNPKG" %}
```html
<script src="https://unpkg.com/@vime-js/complete"></script>
```
{% endtab %}

{% tab title="JSDELIVR" %}
```html
<script src="https://cdn.jsdelivr.net/npm/@vime-js/complete"></script>
```
{% endtab %}
{% endtabs %}

The `dist` folder inside the package contains multiple exports:

- `complete.js` is a UMD development build that can be used directly in the browser via the `<script>` tag.
- `complete.esm.js` is intended for use with modern bundlers like [Webpack][webpack] or [Rollup][rollup].
- `complete.min.js` is a UMD production build that can be used directly in the browser via the `<script>` tag.
- `complete.esm.min.js` is an ESM production build that can be used directly in modern browsers via the `<script type="module">` tag.

{% hint style="info" %}
* UMD builds are exported under the `Vime` namespace.
* If you're using a bundler then it will automatically pull in the correct files.
* If you're using [svelte-loader][svelte-loader] or [rollup-plugin-svelte][svelte-rollup] then you'll receive the uncompiled components.
{% endhint %}

[webpack]: https://webpack.js.org
[rollup]: http://rollupjs.org/guide/en
[svelte-loader]: https://github.com/sveltejs/svelte-loader
[svelte-rollup]: https://github.com/sveltejs/rollup-plugin-svelte

## Setup

{% tabs %}
{% tab title="JavaScript" %}
```js
import { Player, Boot, FileProvider } from '@vime-js/complete';

const target = document.getElementById('player-target');

// Mount
const player = new Player({
  target,
  // If you'd like to initialize any props on setup, you can do so here.
  props: {
    src: '/media/my-video.mp4',
    plugins: [Boot],
    providers: [FileProvider]
  }
});

const off = player.$on('mount', () => {
  // Interact with the player and plugins here.
});

// ...

// Destroy
off();
player.$destroy();
```

{% hint style="info" %}
See the [client-side component API][svelte-client-api] for the complete set of component initialization options.
{% endhint %}
{% endtab %}

[svelte-client-api]: https://svelte.dev/docs#Client-side_component_API

{% tab title="Svelte" %}
```html
<Player
  src="/media/my-video.mp4"
  plugins={[Boot]}
  providers={[FileProvider]}
  on:mount={onPlayerMount}
  bind:this={player} 
/>

<script>
  import { Player, Boot, FileProvider } from '@vime-js/complete';

  let player;

  const onPlayerMount = () => {
    // Interact with the player and plugins here.
  };
</script>
```
{% endtab %}
{% endtabs %}

## Important Notes

- To see how to set the `src` prop checkout the [loading media guide](../guides/loading-media.md).
- If you want more control over which plugins are loaded then see the [plugins getting started page](../plugins/getting-started.md).
- For all providers see this [page](../../vime-standard/src/providers/index.js).
- You don't need to load any Vime specific icons or CSS, they're all loaded via plugins.
- Vime only has a few basic [events](./api/player.md#events), you listen to changes through store subscriptions. For example, 
  if you wanted to get updates on the `currentTime`, you'd subscribe to it. More information can be found 
  [here](./api/player.md#store).
- This player extends the Standard Player, all the props/methods/events listed [here](../standard/api/player.md) are 
  also available directly from the Complete Player.

## Where to next?

To customize the player go to the [customization](./customization.md) page, and then go to the [API](./api/player.md) 
section to find out how to interact with the player. Also checkout the [provider notes](../standard/notes.md) for 
any provider specific issues or features.
