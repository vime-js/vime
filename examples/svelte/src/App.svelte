<script lang="ts">
  import { Player, Video, DefaultUi, usePlayerStore } from '@vime/svelte';

  // Custom UI component.
  import TapSidesToSeek from './TapSidesToSeek.svelte';

  // Obtain a ref if you need to call any methods.
  let player: Player;

  /**
   * All player properties are available through the store. If you prefer, you could also pass
   * properties directly to the player and listen for events.
   */
  const { paused } = usePlayerStore(() => player);

  const onPlaybackReady = () => {
    // ...
  };

  $: console.log($paused);
</script>

<div id="container">
  <Player on:vPlaybackReady={onPlaybackReady} bind:this={player}>
    <Video
      crossOrigin=""
      poster="https://files.vidstack.io/agent-327/poster.png"
    >
      <source
        data-src="https://files.vidstack.io/agent-327/720p.mp4"
        type="video/mp4"
      />
    </Video>

    <DefaultUi>
      <TapSidesToSeek />
    </DefaultUi>
  </Player>
</div>

<style>
  :global(html),
  :global(body) {
    width: 100%;
    height: 100%;
  }

  :global(body) {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #container {
    width: 100%;
    max-width: 960px;
  }
</style>
