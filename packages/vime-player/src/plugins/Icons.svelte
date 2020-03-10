<svelte:head>
  <div style="display: none;">{@html sprite}</div>
</svelte:head>

<script context="module">
  export const ID = 'vIcons';
</script>

<script>
  import { onDestroy } from 'svelte';
  import sprite from '../static/vime.svg';

  export let player;

  const store = player.getStore();
  
  const icon = icon => `#vime-${icon}`;
  const ICONS = {
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

  store.icons.set(ICONS);

  onDestroy(() => {
    const icons = player.icons;
    if (!icons) return;
    Object.keys(ICONS).forEach(icon => {
      if (icons[icon] && icons[icon] === ICONS[icon]) delete icons[icon];
    });
    store.icons.set(icons);
  });
</script>