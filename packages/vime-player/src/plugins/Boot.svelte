<svelte:options accessors />

<script context="module">
  export const ID = 'vBoot';
</script>

<script>
  import { noop } from 'svelte/internal';
  import { IS_IOS, is_undefined } from '@vime/utils';

  // TODO: should/can everything below be dynamically imported?

  import {
    get_playback_icon,
    get_pip_icon,
    get_captions_icon,
    get_fullscreen_icon,
    get_volume_icon
  } from '../utils';

  // Plugins
  import {
    Icons,
    Poster,
    Scrim,
    Spinner,
    ClickToPlay,
    ActionDisplay,
    Keyboard,
    Controls,
    Tooltips,
    DblClickFullscreen
  } from '../';

  // Controls
  import {
    PlaybackControl,
    MuteControl,
    VolumeControl,
    CurrentTime,
    DurationTime,
    TimeProgress,
    CaptionControl,
    PiPControl,
    LiveIndicator,
    FullscreenControl,
    ScrubberControl,
    SeekForwardControl,
    SeekBackwardControl,
    ControlSpacer,
    ControlNewLine
  } from '../';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = {};

  const pluginsManager = player.getPluginsManager();
  const plugins = player.getPluginsRegistry();

  const {
    paused, icons, volume,
    muted, captionsActive, pipActive,
    fullscreenActive, currentTime, duration,
    isAudio, isVideo, canInteract, 
    isMobile, canSetTrack, canSetPiP,
    canSetFullscreen, isLive, currentTrack
  } = player.getStore();

  const PLUGINS = [
    Icons,
    Poster,
    Scrim,
    Spinner,
    ClickToPlay,
    ActionDisplay,
    Controls,
    Keyboard,
    Tooltips,
    DblClickFullscreen
  ];

  const isPluginEnabled = Plugin => {
    const id = Plugin.ID.slice(1);
    const configId = id.charAt(0).toLowerCase() + id.slice(1);
    if (is_undefined(config[configId])) config[configId] = true;
    return config[configId];
  };

  const isPluginDisabled = Plugin => !isPluginEnabled(Plugin);

  $: if (config) pluginsManager.addPlugins(PLUGINS.filter(isPluginEnabled));
  $: if (config) pluginsManager.removePlugins(PLUGINS.filter(isPluginDisabled));

  // --------------------------------------------------------------
  // Keyboard
  // --------------------------------------------------------------

  const safeActionDisplay = (icon, value) => {
    const actionDisplay = player[ActionDisplay.ID];
    if (actionDisplay) actionDisplay.run(icon, value);
  };

  let hasKeyboardInitialized = false;

  $: keyboard = config && isPluginEnabled(Keyboard) && $plugins[Keyboard.ID];

  const onInitializeKeyboard = () => {
    const keyboardRegistry = keyboard.getRegistry();

    keyboardRegistry.register(PlaybackControl.LABEL, {
      hint: 'space/k',
      keys: [32, 75],
      action: () => {
        if (!$canInteract) return;
        $paused = !$paused;
        safeActionDisplay(get_playback_icon($icons, !$paused));
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
        safeActionDisplay(icon, `${$volume}%`);
      }
    });

    keyboardRegistry.register(MuteControl.LABEL, {
      hint: 'm',
      keys: [77],
      action: () => {
        if (!$canInteract) return;
        $muted = !$muted;
        safeActionDisplay(get_volume_icon($icons, $muted, $volume));
      }
    });

    let prevTrack = -1;
    keyboardRegistry.register(CaptionControl.LABEL, {
      hint: 'c',
      keys: [67],
      action: () => {
        if (!$canInteract || !$canSetTrack) return;
        $captionsActive ? ($currentTrack = -1) : ($currentTrack = prevTrack);
        prevTrack = $currentTrack;
        safeActionDisplay(get_captions_icon($icons, $captionsActive));
      }
    });

    keyboardRegistry.register(PiPControl.LABEL, {
      hint: 'p',
      keys: [80],
      action: () => {
        if (!$canInteract || !$canSetPiP) return;
        $pipActive ? player.exitPiP().catch(noop) : player.requestPiP().catch(noop);
        safeActionDisplay(get_pip_icon($icons, $pipActive));
      }
    });

    keyboardRegistry.register(FullscreenControl.LABEL, {
      hint: 'f',
      keys: [70],
      action: () => {
        if (!$canInteract || !$canSetFullscreen) return;
        $fullscreenActive ? player.exitFullscreen().catch(noop) : player.requestFullscreen().catch(noop);
        safeActionDisplay(get_fullscreen_icon($icons, $fullscreenActive));
      }
    });

    keyboardRegistry.register(ScrubberControl.LABEL, {
      // Left Arrow (37), Right Arrow (39)
      keys: [37, 39],
      action: e => {
        if (!$canInteract) return;
        const isLeft = e.keyCode === 37;
        $currentTime = isLeft ? Math.max(0, $currentTime - 5) : Math.min($duration, $currentTime + 5);
        safeActionDisplay(isLeft ? $icons.seekBackward : $icons.seekForward);
      }
    });

    hasKeyboardInitialized = true;
  };

  $: if (keyboard && !hasKeyboardInitialized) onInitializeKeyboard();
  $: if (!keyboard && hasKeyboardInitialized) hasKeyboardInitialized = false;

  // --------------------------------------------------------------
  // Controls
  // --------------------------------------------------------------

  $: controls = config && isPluginEnabled(Controls) && $plugins[Controls.ID];

  const onSetupAudioControls = () => {
    controls.upper = [];
    controls.center = [];
    // TODO: add settings control here
    controls.lower = !$isLive ? [
      PlaybackControl, VolumeControl, CurrentTime,
      ScrubberControl, DurationTime
    ]: [
      PlaybackControl, volume, CurrentTime, 
      ControlSpacer, LiveIndicator
    ];
  };

  const onSetupDesktopVideoControls = () => {
    controls.upper = [];
    controls.center = [];
    // TODO: add settings control here
    controls.lower = !$isLive ? [
      ScrubberControl, ControlNewLine, PlaybackControl, 
      VolumeControl, TimeProgress, ControlSpacer, 
      CaptionControl, PiPControl, FullscreenControl
    ] : [
      PlaybackControl, VolumeControl, ControlSpacer, 
      LiveIndicator, PiPControl, FullscreenControl
    ];
  };

  const onSetupMobileVideoControls = () => {
    if (!$isLive) {
      // TODO: add settings here before fs
      controls.upper = [ControlSpacer, VolumeControl, CaptionControl, FullscreenControl];
      controls.center = [SeekBackwardControl, PlaybackControl, SeekForwardControl];
    } else {
      controls.upper = [ControlSpacer, VolumeControl, FullscreenControl];
      controls.center = [PlaybackControl];
    }
  };

  $: if (controls && $isAudio) onSetupAudioControls($isLive)
  $: if (controls && $isVideo && !$isMobile) onSetupDesktopVideoControls($isLive)
  $: if (controls && $isVideo && $isMobile) onSetupMobileVideoControls($isLive)
</script>

