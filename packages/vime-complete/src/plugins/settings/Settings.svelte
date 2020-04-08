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
        shouldRenderTooltip={false}
        on:click={onMenuClose}
      >
        {$i18n.close}
      </Control>
    </div>
  </div>
  <Menu
    id={menuId}
    isActive={$isMenuActive}
    aria-labelledby={controllerId}
    on:open
    on:close
    on:close={onMenuClose}
    bind:this={menu}
  >
    {#each submenus as id (id)}
      <svelte:component 
        {player}
        hideController={!is_null($currentSubmenu) && $currentSubmenu !== id}
        on:open="{() => { onSubmenuOpen(id); }}"
        on:close={onSubmenuClose}
        this={submenuType[id]}
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

  const Event = {
    OPEN_SUBMENU: 'opensubmenu',
    CLOSE_SUBMENU: 'closesubmenu',
  };
</script>

<script>
  import { tick, createEventDispatcher } from 'svelte';
  import { writable } from 'svelte/store';
  import Menu from './menu/Menu.svelte';
  import Submenu from './menu/submenu/Submenu.svelte';
  import Control from '../controls/control/Control.svelte';
  import { is_null, private_writable, map_store_to_component } from '@vime-js/utils';

  // eslint-disable-next-line prefer-const
  menuIdCounter += 1;
  const menuId = `v-settings-${menuIdCounter}`;
  const controllerId = `v-settings-control-${menuIdCounter}`;

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;

  const dispatch = createEventDispatcher();
  const registry = player.createRegistry(ID);
  const { i18n, isMobile, isVideoView } = player.getStore();

  const store = {
    isMenuActive: writable(false),
    currentSubmenu: private_writable(null),
  };

  const onPropsChange = map_store_to_component(null, store);
  $: onPropsChange($$props);

  const { isMenuActive, currentSubmenu } = store;

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let menu;
  let submenus = [];
  
  const submenuType = {};
  const instances = {};

  export const getId = () => menuId;
  export const getEl = () => el;
  export const getMenu = () => menu;
  export const getControllerId = () => controllerId;
  export const getRegistry = () => registry;
  export const getSubmenus = () => instances;
  export const getSubmenu = (id) => instances[id];

  export const createSubmenu = async (id, type = Submenu) => {
    submenus.push(id);
    submenuType[id] = type;
    await tick();
    return instances[id];
  };

  export const createSubmenus = (ids, type = Submenu) => {
    const promises = ids.map((id) => createSubmenu(id, type));
    return Promise.all(promises);
  };

  export const removeSubmenu = (id) => {
    submenus = submenus.filter((itemId) => itemId !== id);
    delete submenuType[id];
    return tick();
  };

  export const removeSubmenus = (ids) => {
    ids.map(removeSubmenu);
    return tick();
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const onMenuClose = () => { $isMenuActive = false; };
  
  const onSubmenuOpen = (id) => {
    $currentSubmenu = id;
    dispatch(Event.OPEN_SUBMENU, id);
  };

  const onSubmenuClose = () => {
    dispatch(Event.CLOSE_SUBMENU, $currentSubmenu);
    $currentSubmenu = null;
  };

  $: isModalHeaderHidden = !$isMobile || !$isVideoView || !is_null($currentSubmenu);

  $: submenus
    .filter((id) => !registry.has(id) && instances[id])
    .forEach((id) => registry.register(id, instances[id]));
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