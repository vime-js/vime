<svelte:head>
  <div style="display: none;">{@html sprite}</div>
</svelte:head>

<script>
  import sprite from '~static/vime.svg';

  export let player

  const icon = icon => `#vime-${icon}`;
  player.icons = {
    play: icon('play'),
    pause: icon('pause'),
    captionsOn: icon('captions-on'),
    captionsOff: icon('captions-off'),
    enterFullscreen: icon('enter-fullscreen'),
    exitFullscreen: icon('exit-fullscreen'),
    enterPiP: icon('enter-pip'),
    exitPiP: icon('exit-pip'),
    seekForward: icon('seek-forward'),
    seekBackward: icon('seek-backward'),
    volumeLow: icon('volume-low'),
    volumeHigh: icon('volume-high'),
    volumeMute: icon('volume-mute'),
    settings: icon('settings'),
    checkmark: icon('checkmark')
  };
</script>