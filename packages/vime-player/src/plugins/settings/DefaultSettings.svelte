<script context="module">
  export const ID = 'vDefaultSettings';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { ID as SettingsID } from './Settings.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const { i18n, isVideoView, isAudio } = player.getStore();

  // --------------------------------------------------------------
  // Settings Plugin
  // --------------------------------------------------------------

  let menuItems;

  const settingsPlugin = player.getPluginsRegistry().watch(SettingsID);

  $: if ($settingsPlugin) ({ menuItems } = $settingsPlugin.getStore())

  // --------------------------------------------------------------
  // Playback Rate Menu
  // --------------------------------------------------------------

  const PLAYBACK_RATE_MENU = 'playbackRateMenu';

  const { canSetPlaybackRate, playbackRate, playbackRates } = player.getStore();

  onDestroy(() => { if ($menuItems) delete $menuItems[PLAYBACK_RATE_MENU]; })

  $: if ($menuItems) {
    $menuItems[PLAYBACK_RATE_MENU] = {
      title: $i18n.speed,
      value: $playbackRate,
      options: playbackRateMenuOptions,
      emptyHint: $i18n.normal,
      isDisabled: !$canSetPlaybackRate || ($playbackRates.length === 0),
      onValueChange: v => { $playbackRate = v; }
    };
  }

  $: playbackRateMenuOptions = ($playbackRates.length === 1)
    ? [] 
    : $playbackRates.map(rate => ({
      title: (rate === 1) ? $i18n.normal : rate,
      value: rate
    }));

  // --------------------------------------------------------------
  // Captions Menu
  // --------------------------------------------------------------

  const CAPTION_MENU = 'captionMenu';
  
  const { canSetTrack, tracks, currentTrackIndex } = player.getStore();

  onDestroy(() => { if ($menuItems) delete $menuItems[CAPTION_MENU]; })

  $: if ($menuItems) {
    $menuItems[CAPTION_MENU] = {
      title: $i18n.subtitlesOrCc,
      value: $currentTrackIndex,
      options: captionMenuOptions,
      emptyHint: $i18n.none,
      isDisabled: !$canSetTrack || ($tracks.length === 0),
      onValueChange: v => { $currentTrackIndex = v; }
    };
  }

  $: captionMenuOptions = (!$isVideoView)
    ? [] 
    : [{
      title: $i18n.off,
      value: -1
    }, ...$tracks.map((track, i) => ({
      title: track.label,
      value: i
    }))];

  // --------------------------------------------------------------
  // Quality Menu
  // --------------------------------------------------------------
  
  const VIDEO_QUALITY_MENU = 'videoQualityMenu';
  
  const { canSetVideoQuality, videoQualities, videoQuality } = player.getStore();

  onDestroy(() => { if ($menuItems) delete $menuItems[VIDEO_QUALITY_MENU]; })

  $: if ($menuItems) {
    $menuItems[VIDEO_QUALITY_MENU] = {
      title: $i18n.videoQuality,
      value: $videoQuality,
      options: videoQualityMenuOptions,
      emptyHint: $i18n.default,
      isDisabled: !$canSetVideoQuality || ($videoQualities.length === 0),
      onValueChange: v => { $videoQuality = v; }
    };
  }

  $: videoQualityMenuOptions = $isAudio ? [] : $videoQualities.map(quality => ({
    title: `${quality}p`,
    value: quality,
    badge: (quality >= 720) ? 'HD' : null
  }));
</script>