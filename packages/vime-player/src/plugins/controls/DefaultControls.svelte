<script context="module">
  export const ID = 'vDefaultControls';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { ID as ControlsID } from './Controls.svelte';

  import * as PlaybackControl from './control/PlaybackControl.svelte';
  import * as BigPlaybackControl from './control/BigPlaybackControl.svelte';
  import * as CaptionControl from './control/CaptionControl.svelte';
  import * as MuteControl from './control/MuteControl.svelte';
  import * as PiPControl from './control/PiPControl.svelte';
  import * as FullscreenControl from './control/FullscreenControl.svelte';
  import * as VolumeControl from './control/VolumeControl.svelte';
  import * as ScrubberControl from './control/ScrubberControl.svelte';
  import * as LiveIndicator from './control/LiveIndicator.svelte';
  import * as SettingsControl from './control/SettingsControl.svelte';
  import * as ControlSpacer from './control/ControlSpacer.svelte';
  import * as ControlNewLine from './control/ControlNewLine.svelte';
  import * as CurrentTime from './control/time/CurrentTime.svelte';
  import * as DurationTime from './control/time/DurationTime.svelte';
  import * as TimeDivider from './control/time/TimeDivider.svelte';
  import * as TimeProgress from './control/time/TimeProgress.svelte';

  export let player;

  const plugins = player.getPluginsRegistry();

  const {
    isLive, isVideoView, isMobile,
    playbackStarted
  } = player.getStore();

  const onSetupAudioControls = () => {
    controlsPlugin.upper = [];
    controlsPlugin.center = [];
    controlsPlugin.lower = !$isLive ? [
      PlaybackControl, VolumeControl, CurrentTime,
      ScrubberControl, DurationTime, SettingsControl
    ]: [
      PlaybackControl, VolumeControl, CurrentTime,
      ControlSpacer, LiveIndicator
    ];
  };

  const onSetupDesktopVideoControls = () => {
    controlsPlugin.upper = [];
    controlsPlugin.center = [];
    controlsPlugin.lower = !$isLive ? [
      ScrubberControl, ControlNewLine, PlaybackControl,
      VolumeControl, TimeProgress, ControlSpacer,
      CaptionControl, PiPControl, SettingsControl,
      FullscreenControl
    ] : [
      PlaybackControl, VolumeControl, ControlSpacer,
      LiveIndicator, PiPControl, FullscreenControl
    ];
  };

  const onSetupMobileVideoControls = () => {
    if (!$isLive) {
      controlsPlugin.upper = [ControlSpacer, VolumeControl, CaptionControl, SettingsControl];
      controlsPlugin.center = [BigPlaybackControl];
      controlsPlugin.lower = [
        CurrentTime, ControlSpacer, DurationTime,
        FullscreenControl, ControlNewLine, ScrubberControl
      ];
    } else {
      controlsPlugin.upper = [ControlSpacer, VolumeControl, FullscreenControl];
      controlsPlugin.center = [BigPlaybackControl];
    }
  };

  onDestroy(() => {
    if (!$plugins[ControlsID]) return;
    controlsPlugin.lower = [];
    controlsPlugin.center = [];
    controlsPlugin.upper = [];
  });

  $: controlsPlugin = $plugins[ControlsID];
  $: if (controlsPlugin && !$isVideoView) onSetupAudioControls($isLive);
  $: if (controlsPlugin && $isVideoView && !$isMobile) onSetupDesktopVideoControls($isLive);
  $: if (controlsPlugin && $isVideoView && $isMobile) onSetupMobileVideoControls($isLive);
</script>