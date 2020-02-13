<div class="container">
  <div class="player" class:audio={$isAudio}>
    <Player {...$$props} debug bind:this={player} />
  </div>
</div>

<script>
  import { onMount } from 'svelte'
  import Player from '../../core/Player.svelte'

  let player
  let isAudio

  onMount(() => {
    ({ isAudio } = player.getStore())
  })
</script>

<style>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .player {
    width: 100%;
    max-width: 1280px;
    padding: 16px;
  }

  .player.audio {
    width: 400px;
  }

  @media screen and (min-width: 480px) {
    .player {
      padding: 40px;
    }
  }
</style>