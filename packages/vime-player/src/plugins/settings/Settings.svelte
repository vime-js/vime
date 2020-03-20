<svelte:options accessors />

<div
  class="settings"
  class:audio={!$isVideoView}
  class:video={$isVideoView}
  class:mobile={$isMobile}
  class:active={$isMenuActive}
  bind:this={el}
>
  <div 
    class="modalHeader"
    class:hidden={isModalHeaderHidden}
  >
    <div></div>
    <div>{$i18n.settings}</div>
    <div>
      <Control 
        {player}
        noTooltip 
        on:click={onCloseMenu}
      >
        {$i18n.close}
      </Control>
    </div>
  </div>
  <Menu
    id={menuId}
    aria-hidden={!$isMenuActive}
    aria-labelledby={menuLabelledBy}
    on:menuclose={onCloseMenu}
    bind:this={menu}
  >
    {#each Object.values($menuItems) as { id, ...item }}
      <MenuItem
        {player}
        title={item.title}
        value={item.value}
        options={item.options}
        emptyHint={item.emptyHint}
        isHidden={currentMenuItemId !== null && currentMenuItemId !== id}
        isDisabled={item.isDisabled}
        on:valuechange="{e => item.onValueChange(e.detail)}"
        on:menuchange="{e => onMenuItemChange(id, e.detail)}"
        bind:this={instances[id]}
      />
    {/each}
  </Menu>
</div>

<script context="module">
  import PluginRole from '../../core/PluginRole';

  export const ID = 'vSettings';
  export const ROLE = PluginRole.SETTINGS;

  let menuIdCounter = 0;
</script>

<script>
  import { writable } from 'svelte/store';
  import Menu from './menu/Menu.svelte';
  import MenuItem from './menu/MenuItem.svelte';
  import MenuItemRadio from './menu/MenuItemRadio.svelte';
  import Control from '../controls/Control.svelte';
  import { map_store_to_component } from '@vime-js/utils';

  // eslint-disable-next-line prefer-const
  menuIdCounter += 1;
  const menuId = `settings-${menuIdCounter}`;
  const menuLabelledBy = `settings-control-${menuIdCounter}`;

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const registry = player.createRegistry(ID);
  const logger = player.createLogger(ID);
  const { i18n, isMobile, isVideoView, } = player.getStore();

  const store = { 
    menuItems: writable({}),
    isMenuActive: writable(false)
  };

  const onPropsChange = map_store_to_component(null, store);
  $: onPropsChange($$props);

  const { menuItems, isMenuActive } = store;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let menu;
  const instances = {};
  let currentMenuItemId = null;

  export const getId = () => menuId;
  export const getEl = () => el;
  export const getMenu = () => menu;
  export const getRegistry = () => registry;
  export const getLabelledBy = () => menuLabelledBy;
  export const getCurrentMenuItemId = () => currentMenuItemId;

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onCloseMenu = () => { $isMenuActive = false; };
  const onMenuItemChange = (id, isOpen) => { currentMenuItemId = isOpen ? id : null; };

  $: isModalHeaderHidden = !$isMobile || !$isVideoView || (currentMenuItemId !== null);

  $: Object.keys($menuItems)
    .filter(id => !registry.has(id) && instances[id])
    .forEach(id => registry.register(id, instances[id]));
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
    z-index: 3;
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
      bottom: 64px;
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
      position: fixed;
      transition: top .3s ease-out;

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