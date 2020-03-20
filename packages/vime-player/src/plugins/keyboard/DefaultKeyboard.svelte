<script context="module">
  export const ID = 'vDefaultKeyboard';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { noop } from 'svelte/internal';
  import { ID as KeyboardID } from './Keyboard.svelte';
  import { ID as ActionDisplayID } from '../ActionDisplay.svelte';

  import {
    get_playback_icon,
    get_pip_icon,
    get_captions_icon,
    get_fullscreen_icon,
    get_volume_icon
  } from '../../utils';

  import {
    PlaybackControl,
    VolumeControl,
    MuteControl,
    CaptionControl,
    PiPControl,
    FullscreenControl,
    ScrubberControl
  } from '../controls';

  export let player;

  const plugins = player.getPluginsRegistry();

  const {
    paused, icons, volume,
    muted, isCaptionsActive, isPiPActive,
    isFullscreenActive, currentTime, duration,
    canInteract, canSetTrack, canSetPiP,
    canSetFullscreen, currentTrackIndex
  } = player.getStore();

  let hasKeyboardInitialized = false;

  const displayAction = (icon, value) => {
    const actionDisplay = player[ActionDisplayID];
    if (actionDisplay) actionDisplay.run(icon, value);
  };

  const onInitializeKeyboard = () => {
    keyboardRegistry.register(PlaybackControl.LABEL, {
      hint: 'space/k',
      keys: [32, 75],
      action: () => {
        if (!$canInteract) return;
        $paused = !$paused;
        displayAction(get_playback_icon($icons, !$paused));
      }
    });

    keyboardRegistry.register(VolumeControl.LABEL, {
      // Up Arrow (38), Down Arrow (40)
      keys: [38, 40],
      action: e => {
        if (!$canInteract) return;
        const isUp = e.keyCode === 38;
        $volume = isUp ? Math.min(100, $volume + 5) : Math.max(0, $volume - 5);
        const icon = isUp
          ? $icons.volumeHigh
          : ($volume === 0 ? $icons.volumeMute : $icons.volumeLow);
        displayAction(icon, `${$volume}%`);
      }
    });

    keyboardRegistry.register(MuteControl.LABEL, {
      hint: 'm',
      keys: [77],
      action: () => {
        if (!$canInteract) return;
        $muted = !$muted;
        displayAction(get_volume_icon($icons, $muted, $volume));
      }
    });

    let prevTrackIndex = -1;
    keyboardRegistry.register(CaptionControl.LABEL, {
      hint: 'c',
      keys: [67],
      action: () => {
        if (!$canInteract || !$canSetTrack) return;
        if ($isCaptionsActive) prevTrackIndex = $currentTrackIndex;
        $isCaptionsActive ? ($currentTrackIndex = -1) : ($currentTrackIndex = prevTrackIndex);
        displayAction(get_captions_icon($icons, $isCaptionsActive));
      }
    });

    keyboardRegistry.register(PiPControl.LABEL, {
      hint: 'p',
      keys: [80],
      action: () => {
        if (!$canInteract || !$canSetPiP) return;
        $isPiPActive ? player.exitPiP().catch(noop) : player.requestPiP().catch(noop);
        displayAction(get_pip_icon($icons, $isPiPActive));
      }
    });

    keyboardRegistry.register(FullscreenControl.LABEL, {
      hint: 'f',
      keys: [70],
      action: () => {
        if (!$canInteract || !$canSetFullscreen) return;
        $isFullscreenActive ? player.exitFullscreen().catch(noop) : player.requestFullscreen().catch(noop);
        displayAction(get_fullscreen_icon($icons, $isFullscreenActive));
      }
    });

    keyboardRegistry.register(ScrubberControl.LABEL, {
      // Left Arrow (37), Right Arrow (39)
      keys: [37, 39],
      action: e => {
        if (!$canInteract) return;
        const isLeft = e.keyCode === 37;
        $currentTime = isLeft ? Math.max(0, $currentTime - 5) : Math.min($duration, $currentTime + 5);
        displayAction(isLeft ? $icons.seekBackward : $icons.seekForward);
      }
    });

    hasKeyboardInitialized = true;
  };

  onDestroy(() => {
    if (!$plugins[KeyboardID]) return;
    const deregister = Control => keyboardRegistry.deregister(Control.LABEL);
    deregister(PlaybackControl);
    deregister(VolumeControl);
    deregister(MuteControl);
    deregister(CaptionControl);
    deregister(PiPControl);
    deregister(FullscreenControl);
  });

  $: keyboardPlugin = $plugins[KeyboardID];
  $: keyboardRegistry = keyboardPlugin && keyboardPlugin.getRegistry();
  $: if (keyboardRegistry && !hasKeyboardInitialized) onInitializeKeyboard();
  $: if (!keyboardRegistry && hasKeyboardInitialized) hasKeyboardInitialized = false;
</script>