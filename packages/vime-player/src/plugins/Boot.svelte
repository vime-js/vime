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

  import * as Icons from './Icons.svelte';
  import * as Poster from './Poster.svelte';
  import * as Scrim from './Scrim.svelte';
  import * as Spinner from './Spinner.svelte';
  import * as Captions from './Captions.svelte';
  import * as ClickToPlay from './ClickToPlay.svelte';
  import * as ActionDisplay from './ActionDisplay.svelte';
  import * as Keyboard from './Keyboard.svelte';
  import * as Controls from './controls/Controls.svelte'
  import * as Tooltips from './tooltips/Tooltips.svelte';
  import * as DblClickFullscreen from './DblClickFullscreen.svelte';

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
  } from './controls';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = {};

  const pluginsManager = player.getPluginsManager();
  const plugins = player.getPluginsRegistry();

  const {
    paused, icons, volume,
    muted, isCaptionsActive, isPiPActive,
    isFullscreenActive, currentTime, duration,
    isAudio, isVideo, canInteract, 
    isMobile, canSetTrack, canSetPiP,
    canSetFullscreen, isLive, currentTrackIndex
  } = player.getStore();

  const PLUGINS = [
    Icons,
    Poster,
    Scrim,
    Spinner,
    Captions,
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

  const displayAction = (icon, value) => {
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

