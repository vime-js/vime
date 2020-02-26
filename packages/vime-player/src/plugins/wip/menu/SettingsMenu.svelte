<div
  class="settings"
  class:audio={$isAudio}
  class:video={$isVideo}
  class:mobile={$isMobile}
  class:active={$isMenuActive}
>
  <div 
    class="modalHeader"
    class:hidden={isModalHeaderHidden}
  >
    <div></div>
    <div>{$i18n.settings}</div>
    <div>
      <Control on:click="{() => { $isMenuActive = false; }}">
        {$i18n.close}
      </Control>
    </div>
  </div>
  <Menu
    id={menuId}
    aria-hidden={!$isMenuActive}
    aria-labelledby={menuLabelledBy}
    on:menuclose="{() => { $isMenuActive = false; }}"
    bind:ref={$settingsMenuRef}
  >
    <MenuItem
      title={$i18n.speed}
      value={playbackRate}
      options={speedOptions}
      emptyHint={$i18n.normal}
      isHidden={isCaptionsMenuActive || isQualityMenuActive}
      isDisabled={isSpeedMenuDisabled}
      on:valuechange={onPlaybackRateChange}
      on:menuchange="{e => { isSpeedMenuActive = e.detail; }}"
    />
    <MenuItem
      title={$i18n.subtitlesCC}
      value={$isCaptionsActive ? track.index : -1}
      options={captionOptions}
      emptyHint={$i18n.none}
      isDisabled={isCaptionsMenuDisabled}
      isHidden={isQualityMenuActive || isSpeedMenuActive}
      on:valuechange={onTrackChange}
      on:menuchange="{e => { isCaptionsMenuActive = e.detail; }}"
    />
    <MenuItem
      title={$i18n.quality}
      value={quality}
      options={qualityOptions}
      emptyHint={$i18n.default}
      isHidden={isCaptionsMenuActive || isSpeedMenuActive}
      isDisabled={isQualityMenuDisabled}
      on:valuechange={onQualityChange}
      on:menuchange="{e => { isQualityMenuActive = e.detail; }}"
    />
  </Menu>
</div>

<script context="module">
  import PluginRole from '~src/core/PluginRole';

  export const ID = 'vTracks';
  export const ROLE = PluginRole.SETTINGS;

  let menuIdCounter = 0;
</script>

<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import { ctxKey } from '~src/context';
  import { i18n, isMobile } from '~src/store';
  import Menu from './Menu.svelte';
  import MenuItem from './MenuItem.svelte';
  import MenuItemRadio from './MenuItemRadio.svelte';
  import Control from '~components/controls/control/Control.svelte';

  const dispatch = createEventDispatcher();

  const ctx = getContext(ctxKey);
  const settingsMenuRef = ctx.settingsMenuRef;
  const isAudio = ctx.isAudio;
  const isVideo = ctx.isVideo;
  const isMenuActive = ctx.isMenuActive;
  const isCaptionsActive = ctx.isCaptionsActive;

  // eslint-disable-next-line prefer-const
  menuIdCounter += 1;
  const menuId = `settings-${menuIdCounter}`;
  const menuLabelledBy = `settings-control-${menuIdCounter}`;

  let isCaptionsMenuActive = false;
  let isQualityMenuActive = false;
  let isSpeedMenuActive = false;

  export let provider;
  export let track;
  export let quality;
  export let playbackRate;
  export let tracks = [];
  export let qualities = [];
  export let playbackRates = [];

  const onQualityChange = e => dispatch('qualitychange', e.detail);
  const onPlaybackRateChange = e => dispatch('playbackratechange', e.detail);
  
  const onTrackChange = e => {
    if (e.detail === -1) {
      $isCaptionsActive = false;
      return;
    }
    $isCaptionsActive = true;
    dispatch('trackchange', e.detail);
  };

  $: isCaptionsMenuDisabled = tracks.length === 0;
  $: isQualityMenuDisabled = qualities.length === 0 || !provider || !provider.setQuality;
  $: isSpeedMenuDisabled = playbackRates.length === 1 || !provider || !provider.setPlaybackRate;

  $: isModalHeaderHidden = !$isMobile || !$isVideo ||
    (isSpeedMenuActive || isQualityMenuActive || isCaptionsMenuActive);

  $: captionOptions = ($isAudio || isCaptionsMenuDisabled) ? [] : [{
    title: $i18n.off,
    value: -1
  }, ...tracks.map((track, i) => ({
    title: track.label,
    value: i
  }))];

  $: qualityOptions = $isAudio ? [] : qualities.map(quality => ({
    title: quality,
    value: quality,
    badge: (quality.slice(0, -1) >= 720) ? 'HD' : null
  }));

  $: speedOptions = (playbackRates.length === 1) ? [] : playbackRates.map(rate => ({
    title: (rate === 1) ? $i18n.normal : rate,
    value: rate
  }));
</script>

<style type="text/scss">
  @import '../../style/common';

  $audio-settings-bg: #fff;
  $video-settings-bg: $color-dark;

  $video-scroll-bg: $video-settings-bg;
  $video-scroll-thumb-color: rgba(#fff, 0.25);

  $audio-scroll-bg: $audio-settings-bg;
  $audio-scroll-thumb-color: rgba($color-dark, 0.25);

  .settings {
    position: absolute;
    border-radius: 2px;
    background: $video-settings-bg;
    right: $control-spacing;
    bottom: 64px;
    width: 200px;
    box-shadow: 0 0 8px 2px $color-gray-100;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 65%;
    scrollbar-width: thin;
    scrollbar-color: $video-scroll-thumb-color $video-scroll-bg;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: none;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: $video-scroll-thumb-color;
      border: 2px solid $video-scroll-bg;
    }

    &.active {
      padding: $control-spacing 0;
    }

    &.audio {
      background: $audio-settings-bg;
      bottom: 48px;
      max-height: 200px;
      scrollbar-color: $audio-scroll-thumb-color $audio-scroll-bg;

      &::-webkit-scrollbar-thumb {
        background-color: $audio-scroll-thumb-color;
        border: 2px solid $audio-scroll-bg;
      }
    }

    &.video.mobile {
      width: 100%;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: none;
      z-index: 10;
      top: 100%;
      transition: top .5s ease-out;

      &.active {
        top: 0;
      }
    }
  }

  .modalHeader {
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;
    margin-top: -6px;
    justify-content: center;
    padding: 0 $control-spacing 2px $control-spacing;
    border-bottom: 1px solid $color-white-100;
    margin-bottom: 6px;
    font-size: $font-size-small;
    font-weight: $font-weight-regular;

    &.hidden {
      display: none;
    }

    > div {
      display: flex;
      flex: 1;
      justify-content: center;
    }

    > div:last-child {
      justify-content: flex-end;
    }

    :global(.control) {
      font-size: 13px !important;
    }
  }
</style>