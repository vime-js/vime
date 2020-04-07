<script context="module">
  export const ID = 'vDefaultSettings';
</script>

<script>
  import { onDestroy } from 'svelte';
  import { Disposal } from '@vime-js/core';
  import { ID as SettingsID } from './Settings.svelte';
  import SelectSubmenu from './menu/submenu/SelectSubmenu.svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const disposal = new Disposal();
  const plugins = player.getPluginsRegistry();
  
  const {
    i18n, isVideoView, isAudio,
    canSetVideoQuality, videoQualities, videoQuality,
    canSetTrack, tracks, currentTrackIndex,
    canSetPlaybackRate, playbackRate, playbackRates,
  } = player.getStore();

  let playbackRateMenu;
  let captionsMenu;
  let videoQualityMenu;

  const MENUS = ['vPlaybackRateMenu', 'vCaptionsMenu', 'vVideoQualityMenu'];

  const onCreateMenus = async () => {
    const onValueChange = (menu, callback) => {
      const off = menu.$on('valuechange', (e) => { callback(e.detail); });
      disposal.add(off);
    };

    ([
      playbackRateMenu,
      captionsMenu,
      videoQualityMenu,
    ] = await settings.createSubmenus(MENUS, SelectSubmenu));

    onValueChange(playbackRateMenu, (rate) => { $playbackRate = rate; });
    onValueChange(captionsMenu, (index) => { $currentTrackIndex = index; });
    onValueChange(videoQualityMenu, (quality) => { $videoQuality = quality; });
  };

  const onDestroyMenus = () => {
    disposal.dispose();
    playbackRateMenu = null;
    captionsMenu = null;
    videoQualityMenu = null;
    if (plugins[SettingsID]) settings.removeSubmenus(MENUS);
  };

  onDestroy(onDestroyMenus);

  $: settings = $plugins[SettingsID];
  $: if (settings && !playbackRateMenu) onCreateMenus();
  $: if (!settings && playbackRateMenu) onDestroyMenus();

  // --------------------------------------------------------------
  // Playback Rate Menu
  // --------------------------------------------------------------

  $: if (playbackRateMenu) {
    playbackRateMenu.$set({
      title: $i18n.speed,
      value: $playbackRate,
      options: ($playbackRates.length === 1) ? [] : playbackRateOptions,
      emptyHint: $i18n.normal,
      isLocked: !$canSetPlaybackRate || ($playbackRates.length === 0),
    });
  }

  $: playbackRateOptions = $playbackRates.map((rate) => ({
    title: (rate === 1) ? $i18n.normal : rate,
    value: rate,
  }));

  // --------------------------------------------------------------
  // Captions Menu
  // --------------------------------------------------------------

  $: if (captionsMenu) {
    captionsMenu.$set({
      title: $i18n.subtitlesOrCc,
      value: $currentTrackIndex,
      options: !$isVideoView ? [] : captionsOptions,
      emptyHint: $i18n.none,
      isEnabled: $isVideoView,
      isLocked: !$canSetTrack || ($tracks.length === 0),
    });
  }

  $: captionsOptions = [{
    title: $i18n.off,
    value: -1,
  }, ...$tracks.map((track, i) => ({
    title: track.label,
    value: i,
  }))];

  // --------------------------------------------------------------
  // Video Quality Menu
  // --------------------------------------------------------------
  
  $: if (videoQualityMenu) {
    videoQualityMenu.$set({
      title: $i18n.videoQuality,
      value: $videoQuality,
      options: $isAudio ? [] : videoQualityOptions,
      emptyHint: $i18n.default,
      isEnabled: !$isAudio,
      isLocked: !$canSetVideoQuality || ($videoQualities.length === 0),
    });
  }

  $: videoQualityOptions = $videoQualities.map((quality) => ({
    title: `${quality}p`,
    value: quality,
    badge: (quality >= 720) ? 'HD' : null,
  }));
</script>