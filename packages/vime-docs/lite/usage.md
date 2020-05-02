# Usage

## YouTube

{% tabs %}
{% tab title="JavaScript" %}
```js
import { Player, YouTubeProvider } from '@vime-js/lite';

const target = document.getElementById('player-target');

// Mount
const player = new Player({
  target,
  props: {
    src: 'youtube/R6MlUcmOul8',
    providers: [YouTubeProvider]
  }
});

// We receive updates on the state of the player here.
const off = player.$on('data', e => {
  const { info } = e.detail;

  /**
   * This will be an object containing all player properties such as
   * the currentTime, volume etc.
   **/
  console.log(info);
});

// We interact with the embed via commands.

// Calling method.
player.sendCommand('playVideo');

// Setting a property.
player.sendCommand('setVolume', [50]);

// ...

// Destroy
off();
player.$destroy();
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  src="youtube/R6MlUcmOul8"
  providers{[YouTubeProvider]}
  on:data={onData}
  bind:this={player} 
/>

<script>
  import { onMount } from 'svelte';
  import { Player, YouTubeProvider } from '@vime-js/lite';

  let player;

  // We interact with the embed via commands.
  onMount(() => {
    // Calling method.
    player.sendCommand('playVideo');

    // Setting a property.
    player.sendCommand('setVolume', [50]);
  });

  // We receive updates on the state of the player here.
  const onData = e  => {
    const { info } = e.detail;

    /**
     * This will be an object containing all player properties such as
     * the currentTime, volume etc.
     **/
    console.log(info);
  };
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
For all available commands see the [YouTube API Reference][youtube-api].
{% endhint %}

[youtube-api]: https://developers.google.com/youtube/iframe_api_reference#Playback_controls

## Vimeo

{% tabs %}
{% tab title="JavaScript" %}
```js
import { Player, VimeoProvider } from '@vime-js/lite';

const target = document.getElementById('player-target');

// Mount
const player = new Player({
  target,
  props: {
    src: 'vimeo/154225711',
    providers: [VimeoProvider]
  }
});

/**
 * To get updates from the player we must call the following 
 * for each event we want to listen to.
 **/
player.sendCommand('addEventListener', 'timeupdate');

// We receive updates on the state of the player here.
const off = player.$on('data', e => {
  const data = e.detail;
  if (!data) return;

  // We extract the event name and payload.
  const { event, data: payload } = data;

  if (event === 'playProgress') {
    console.log(payload);
  }

  // If we call a getter method then this how we get the response.
  const { method, value } = data;

  if (method === 'getCurrentTime') {
    console.log(value);
  }
});

// We interact with the embed via commands.

// Calling method.
player.sendCommand('play');

// Setting a property.
player.sendCommand('setVolume', 50);

// Getting a property.
player.sendCommand('getCurrentTime');

// ...

// Destroy
off();
player.$destroy();
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  src="vimeo/154225711"
  providers=[[VimeoProvider]]
  on:data={onData}
  bind:this={player} 
/>

<script>
  import { onMount } from 'svelte';
  import { Player, VimeoProvider } from '@vime-js/lite';

  let player;

  // We interact with the embed via commands.
  onMount(() => {
    /**
     * To get updates from the player we must call the following 
     * for each event we want to listen to.
     **/
    player.sendCommand('addEventListener', 'timeupdate');

    // Calling method.
    player.sendCommand('play');

    // Setting a property.
    player.sendCommand('setVolume', 50);

    // Getting a property.
    player.sendCommand('getCurrentTime');
  });

  // We receive updates on the state of the player here.
  const onData = e  => {
    const data = e.detail;
    if (!data) return;

    // We extract the event name and payload.
    const { event, data: payload } = data;

    if (event === 'timeupdate') {
      console.log(payload);
    }

    // If we call a getter method then this how we get the response.
    const { method, value } = data;

    if (method === 'getCurrentTime') {
      console.log(value);
    }
  };
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
For some reason the event name you pass to the `addEventListener` call is not the same as the 
name that comes through the `data` event. You can use `console.log` to figure it out or see
our [VimeoProvider](../../vime-standard/src/providers/Vimeo.svelte) for more information.
{% endhint %}

{% hint style="info" %}
* For all available commands see the [Vimeo API Reference][vimeo-api].
* For all available events see the [Vimeo Events Reference][vimeo-events].
{% endhint %}

[vimeo-events]: https://developer.vimeo.com/player/sdk/reference#events-for-playback-controls
[vimeo-api]: https://developer.vimeo.com/player/sdk/reference#methods-for-playback-controls

## Dailymotion

{% tabs %}
{% tab title="JavaScript" %}
```js
import { Player, DailymotionProvider } from '@vime-js/lite';

const target = document.getElementById('player-target');

// Mount
const player = new Player({
  target,
  props: {
    src: 'dailymotion/x3a9qe6',
    providers: [DailymotionProvider]
  }
});

// We receive updates on the state of the player here.
const off = player.$on('data', e => {
  const data = e.detail;
  const event = data && data.event;
  if (!event) return;
   
   /**
   * Data is an object that contains additional info regarding the event.
   * If we're listening for timeupdates then data.time would have the
   * current time.
   **/
  console.log(event, data);
});

// We interact with the embed via commands.

// Calling method.
player.sendCommand('play');

// Setting a property.
player.sendCommand('volume', [50]);

// ...

// Destroy
off();
player.$destroy();
```
{% endtab %}

{% tab title="Svelte" %}
```html
<Player
  src="dailymotion/x3a9qe6"
  providers={[DailymotionProvider]}
  on:data={onData}
  bind:this={player} 
/>

<script>
  import { onMount } from 'svelte';
  import { Player, DailymotionProvider } from '@vime-js/lite';

  let player;

  // We interact with the embed via commands.
  onMount(() => {
    // Calling method.
    player.sendCommand('play');

    // Setting a property.
    player.sendCommand('volume', [50]);
  });

  // We receive updates on the state of the player here.
  const onData = e  => {
    const data = e.detail;
    const event = data && data.event;
    if (!event) return;
    
    /**
     * Data is an object that contains additional info regarding the event.
     * If we're listening for timeupdates then data.time would have the
     * current time.
     **/
    console.log(event, data);
  };
</script>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
* For all available commands see the [Dailymotion API Reference][dailymotion-api].
* For all available events see the [Dailymotion Events Reference][dailymotion-events].
{% endhint %}

[dailymotion-api]: https://developer.dailymotion.com/player/#player-api-properties
[dailymotion-events]: https://developer.dailymotion.com/player/#player-api-events
