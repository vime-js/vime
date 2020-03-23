<script context="module">
  export const ID = 'vDefaultControls';
</script>

<script>
  import { tick, onDestroy } from 'svelte';
  import { ID as ControlsID } from './Controls.svelte';

  import * as PlaybackControl from './control/PlaybackControl.svelte';
  import * as BigPlaybackControl from './control/BigPlaybackControl.svelte';
  import * as CaptionControl from './control/CaptionControl.svelte';
  import * as PiPControl from './control/PiPControl.svelte';
  import * as FullscreenControl from './control/FullscreenControl.svelte';
  import * as VolumeControl from './control/VolumeControl.svelte';
  import * as ScrubberControl from './control/ScrubberControl.svelte';
  import * as LiveIndicator from './control/LiveIndicator.svelte';
  import * as SettingsControl from './control/SettingsControl.svelte';
  import * as ControlSpacer from './control/ControlSpacer.svelte';
  import * as ControlNewLine from './control/ControlNewLine.svelte';
  import * as CurrentTime from './control/time/CurrentTime.svelte';
  import * as EndTime from './control/time/EndTime.svelte';
  import * as TimeProgress from './control/time/TimeProgress.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const plugins = player.getPluginsRegistry();
  
  const {
    isLive, isVideoView, isMobile,
    playbackStarted,
  } = player.getStore();

  let lowerGroup;
  let centerGroup;
  let upperGroup;
  let didMount = false;

  const GROUPS = ['vUpperGroup', 'vCenterGroup', 'vLowerGroup'];

  const onCreateGroups = async () => {
    ([upperGroup, centerGroup, lowerGroup] = await controls.createGroups(GROUPS));
    didMount = true;
  };

  const onResetGroups = () => {
    GROUPS.forEach((id) => { controls.getGroup(id).reset(); });
  };

  const onDestroyGroups = () => {
    lowerGroup = null;
    centerGroup = null;
    upperGroup = null;
    if ($plugins[ControlsID]) controls.removeGroups(GROUPS);
  };

  onDestroy(onDestroyGroups);

  $: controls = $plugins[ControlsID];

  $: if (controls && !didMount) {
    onCreateGroups();
  } else if (!controls && didMount) {
    didMount = false;
    onDestroyGroups();
  }

  // --------------------------------------------------------------
  // Audio Controls
  // --------------------------------------------------------------

  const onSetupAudioControls = () => {
    onResetGroups();

    const liveControls = [
      PlaybackControl, VolumeControl, CurrentTime,
      ControlSpacer, LiveIndicator,
    ];

    const stdControls = [
      PlaybackControl, VolumeControl, CurrentTime,
      ScrubberControl, EndTime, SettingsControl,
    ];

    lowerGroup.$set({
      controls: !$isLive ? stdControls : liveControls,
      isActive: true,
    });
  };

  $: if (
    controls
    && !$isVideoView
    && didMount
  ) onSetupAudioControls($isLive);

  // --------------------------------------------------------------
  // Desktop Video Controls
  // --------------------------------------------------------------

  const onSetupDesktopVideoControls = () => {
    onResetGroups();

    const liveControls = [
      PlaybackControl, VolumeControl, ControlSpacer,
      LiveIndicator, PiPControl, FullscreenControl,
    ];

    const stdControls = [
      ScrubberControl, ControlNewLine, PlaybackControl,
      VolumeControl, TimeProgress, ControlSpacer,
      CaptionControl, PiPControl, SettingsControl,
      FullscreenControl,
    ];

    lowerGroup.$set({
      shouldFill: true,
      isActive: true,
      position: 'flex-end:flex-start',
      controls: !$isLive ? stdControls : liveControls,
    });
  };

  $: if (
    controls
    && $isVideoView
    && !$isMobile
    && didMount
  ) onSetupDesktopVideoControls($isLive);

  // --------------------------------------------------------------
  // Mobile Video Controls
  // --------------------------------------------------------------

  const onSetupMobileVideoControls = () => {
    onResetGroups();

    const upperStdControls = [ControlSpacer, VolumeControl, CaptionControl, SettingsControl];
    const upperLiveControls = [ControlSpacer, VolumeControl, FullscreenControl];
    upperGroup.controls = !$isLive ? upperStdControls : upperLiveControls;

    centerGroup.$set({
      isActive: true,
      shouldFill: true,
      position: 'center:center',
      controls: [BigPlaybackControl],
    });

    const lowerStdControls = [
      CurrentTime, ControlSpacer, EndTime,
      FullscreenControl, ControlNewLine, ScrubberControl,
    ];

    lowerGroup.controls = !$isLive ? lowerStdControls : [];
  };

  const onMobileVideoStart = async () => {
    // Wait to mount new controls if switching to mobile mid-playback.
    await tick();
    upperGroup.isActive = true;
    lowerGroup.isActive = true;
  };

  $: isMobileVideo = $isVideoView && $isMobile && didMount;
  $: if (controls && isMobileVideo) onSetupMobileVideoControls($isLive);
  $: if (controls && isMobileVideo && $playbackStarted) onMobileVideoStart();
</script>