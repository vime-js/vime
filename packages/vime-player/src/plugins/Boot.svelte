<svelte:options accessors />

<script context="module">
  export const ID = 'vBoot';
</script>

<script>
  import { is_undefined } from '@vime-js/utils';

  // TODO: should/can everything below be dynamically imported?

  import { vimeIcons } from '../core';
  import * as Poster from './Poster.svelte';
  import * as Scrim from './Scrim.svelte';
  import * as Spinner from './Spinner.svelte';
  import * as Captions from './Captions.svelte';
  import * as ClickToPlay from './ClickToPlay.svelte';
  import * as ActionDisplay from './ActionDisplay.svelte';
  import * as Keyboard from './keyboard/Keyboard.svelte';
  import * as DefaultKeyboard from './keyboard/DefaultKeyboard.svelte';
  import * as Controls from './controls/Controls.svelte';
  import * as DefaultControls from './controls/DefaultControls.svelte';
  import * as Tooltips from './tooltips/Tooltips.svelte';
  import * as Settings from './settings/Settings.svelte';
  import * as DefaultSettings from './settings/DefaultSettings.svelte';
  import * as DblClickFullscreen from './DblClickFullscreen.svelte';

  export let player;
  export let manifest = {};
  
  player.icons = vimeIcons;

  const pluginsManager = player.getPluginsManager();

  const PLUGINS = [
    Poster,
    Scrim,
    Spinner,
    Captions,
    ClickToPlay,
    ActionDisplay,
    Controls,
    DefaultControls,
    Keyboard,
    DefaultKeyboard,
    Tooltips,
    Settings,
    DefaultSettings,
    DblClickFullscreen,
  ];

  const isPluginEnabled = (Plugin) => {
    const id = Plugin.ID.slice(1);
    const manifestId = id.charAt(0).toLowerCase() + id.slice(1);
    if (is_undefined(manifest[manifestId])) manifest[manifestId] = true;
    return manifest[manifestId];
  };

  const isPluginDisabled = (Plugin) => !isPluginEnabled(Plugin);

  $: if (manifest) pluginsManager.addPlugins(PLUGINS.filter(isPluginEnabled));
  $: if (manifest) pluginsManager.removePlugins(PLUGINS.filter(isPluginDisabled));
</script>

