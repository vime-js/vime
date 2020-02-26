<svelte:options accessors />

<script context="module">
  export const ID = 'vBoot';

  export const DEFAULT_CONFIG = {
    poster: true,
    scrim: true,
    spinner: true,
    clickToPlay: true,
    actionDisplay: true,
    keyboard: true,
    controls: true,
    tooltips: true,
    fullscreen: true,
    dblClickFullscreen: true
  };
</script>

<script>
  import { IS_IOS } from '~utils/support';

  // TODO: should/can everything below be dynamically imported?

  import {
    get_playback_icon,
    get_pip_icon,
    get_captions_icon,
    get_fullscreen_icon,
    get_volume_icon
  } from '~utils/icon';

  // Plugins
  import {
    Poster,
    Scrim,
    Spinner,
    ClickToPlay,
    ActionDisplay,
    Keyboard,
    Controls,
    Tooltips,
    Fullscreen,
    DblClickFullscreen
  } from '~src/main';

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
  } from '~src/main';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = DEFAULT_CONFIG;

  const pluginsManager = player.getPluginsManager();
  const plugins = pluginsManager.getRegistry();
  const { isMobile, isTouch } = player.getGlobalStore();

  const {
    isPaused, icons, volume,
    isMuted, isCaptionsActive, isPiPActive,
    isFullscreenActive, currentTime, duration,
    isAudio, isVideo, canInteract
  } = player.getStore();

  const _plugins = [
    Poster,
    Scrim,
    Spinner,
    ClickToPlay,
    ActionDisplay,
    Controls,
    Keyboard,
    Tooltips,
    Fullscreen,
    DblClickFullscreen
  ];

  const isPluginEnabled = Plugin => {
    const id = Plugin.ID.slice(1);
    const configId = id.charAt(0).toLowerCase() + id.slice(1);
    return config[configId];
  };

  const isPluginDisabled = Plugin => !isPluginEnabled(Plugin);

  $: {
    pluginsManager.addPlugins(_plugins.filter(isPluginEnabled));
    pluginsManager.removePlugins(_plugins.filter(isPluginDisabled));
  }

  // --------------------------------------------------------------
  // Keyboard
  // --------------------------------------------------------------

  const safeRunAction = (icon, value) => {
    const actionDisplay = player[ActionDisplay.ID];
    if (actionDisplay) actionDisplay.run(icon, value);
  };

  let hasKeyboardInitialized = false;

  $: keyboard = isPluginEnabled(Keyboard) && $plugins[Keyboard.ID];

  $: if (keyboard && !hasKeyboardInitialized) {
    keyboard.register(PlaybackControl.LABEL, {
      hint: 'space/k',
      keys: [32, 75],
      action: async () => {
        if (!$canInteract) return;
        $isPaused = !$isPaused;
        safeRunAction(get_playback_icon($icons, $isPaused));
      }
    });

    keyboard.register(VolumeControl.LABEL, {
      // Up Arrow (38), Down Arrow (40)
      keys: [38, 40],
      action: e => {
        if (!$canInteract) return;
        const isUp = e.keyCode === 38;
        $volume = isUp ? Math.min(100, $volume + 5) : Math.max(0, $volume - 5);
        const icon = isUp
          ? $icons.volumeHigh
          : ($volume === 0 ? $icons.volumeMute : $icons.volumeLow);
        safeRunAction(icon, `${$volume}%`);
      }
    });

    keyboard.register(MuteControl.LABEL, {
      hint: 'm',
      keys: [77],
      action: async () => {
        if (!$canInteract) return;
        $isMuted = !$isMuted;
        safeRunAction(get_volume_icon($icons, $isMuted, $volume));
      }
    });

    keyboard.register(CaptionControl.LABEL, {
      hint: 'c',
      keys: [67],
      action: async () => {
        if (!$canInteract) return;
        $isCaptionsActive = !$isCaptionsActive;
        safeRunAction(get_captions_icon($icons, $isCaptionsActive));
      }
    });

    keyboard.register(PiPControl.LABEL, {
      hint: 'p',
      keys: [80],
      action: async () => {
        if (!$canInteract) return;
        $isPiPActive = !$isPiPActive;
        safeRunAction(get_pip_icon($icons, !$isPiPActive));
      }
    });

    keyboard.register(FullscreenControl.LABEL, {
      hint: 'f',
      keys: [70],
      action: async () => {
        if (!$canInteract) return;
        $isFullscreenActive = !$isFullscreenActive;
        safeRunAction(get_fullscreen_icon($icons, !$isFullscreenActive));
      }
    });

    keyboard.register(ScrubberControl.LABEL, {
      // Left Arrow (37), Right Arrow (39)
      keys: [37, 39],
      action: e => {
        if (!$canInteract) return;
        const isLeft = e.keyCode === 37;
        $currentTime = isLeft ? Math.max(0, $currentTime - 5) : Math.min($duration, $currentTime + 5);
        safeRunAction(isLeft ? $icons.seekBackward : $icons.seekForward);
      }
    });

    hasKeyboardInitialized = true;
  }

  $: if (!keyboard && hasKeyboardInitialized) hasKeyboardInitialized = false;

  // --------------------------------------------------------------
  // Controls
  // --------------------------------------------------------------

  $: controls = isPluginEnabled(Controls) && $plugins[Controls.ID];

  $: if (controls && $isAudio) {
    controls.upper = [];
    controls.center = [];
    controls.lower = [
      PlaybackControl, VolumeControl, CurrentTime,
      ScrubberControl, DurationTime
    ];
    // if LS -> pb, volume, time, spacer, live, settings
    // else -> pb, volume, currentTime, scrubber, duration, settings
  }

  $: if (controls && $isVideo && !$isMobile) {
    controls.upper = [];
    controls.center = [];
    controls.lower = [
      ScrubberControl, ControlNewLine,
      PlaybackControl, VolumeControl, TimeProgress,
      ControlSpacer, CaptionControl, PiPControl,
      FullscreenControl
    ];
    // if desktop & LS -> pb, volume, spacer, live, pip, fs
    // if desktop && !LS -> scrubber, newLine, pb, volume, time, spacer, cap, settings, pip, fs
  }

  $: if (controls && $isVideo && $isMobile) {
    // if mobile & LS -> pb (center) / spacer, volume, fs (upper)
    // if mobile & !LS -> seekB, pb, seekF (center) / spacer, vol, caption, settings, fs (upper)
  }
</script>

