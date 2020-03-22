<script context="module">
  export const ID = 'vIcons';
</script>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { load_sprite } from '@vime-js/utils';

  export let player;

  const { icons } = player.getStore();

  let iconsContainer;

  const icon = (id) => `#vime-${id}`;
  
  const vimeIcons = {
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
    checkmark: icon('checkmark'),
  };

  onMount(() => {
    Object.keys(vimeIcons).forEach((id) => {
      if ($icons[id]) return;
      $icons = {
        ...$icons,
        [id]: vimeIcons[id],
      };
    });

    load_sprite('https://unpkg.com/@vime-js/player/static/sprite.svg')
      .then((container) => { iconsContainer = container; });
  });

  onDestroy(() => {
    Object.keys(vimeIcons).forEach((id) => {
      if ($icons[id] !== vimeIcons[id]) return;
      $icons = {
        ...$icons,
        [id]: null,
      };
    });

    if (iconsContainer) { iconsContainer.parentNode.removeChild(iconsContainer); }
  });
</script>