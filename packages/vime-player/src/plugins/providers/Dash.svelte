<Html5Provider
  {player}
  config={html5Config}
  on:providerready
  on:playbackready
  on:playing
  on:ended
  on:buffered
  on:buffering
  on:qualitychange
  on:pipchange
  on:error
  bind:this={h5Player} 
/>

<script context="module">
  import { is_string } from '~utils/unit';
  import { load_sdk } from '~utils/load';
  import PluginRole from '~core/PluginRole';
  import Html5Provider, { canPlay as html5CanPlay } from './html5/Html5.svelte';

  const html5Config = { forceVideo: true };

  const DASH_EXTENSIONS = /\.(mpd)($|\?)/i;
  
  export const ID = 'vDash';
  export const ROLE = PluginRole.PROVIDER;

  export const DEFAULT_CONFIG = {
    version: 'latest',
    debug: false,
    force: false
  };

  export const getSDK = version => {
    const sdkURL = 'https://unpkg.com/dashjs@{V}/dist/dash.all.min.js'.replace('{V}', version);
    return load_sdk(sdkURL, 'dashjs');
  };

  const canPlayResource = resource => is_string(resource) && DASH_EXTENSIONS.test(resource);
  export const canPlay = src => html5CanPlay(src, canPlayResource);
</script>

<script>
  import { onDestroy, createEventDispatcher } from 'svelte';
  import ProviderEvent from './ProviderEvent';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player;
  export let config = DEFAULT_CONFIG;

  const logger = player.createLogger(ID);
  const dispatch = createEventDispatcher();

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let dash;
  let h5Player;

  export const loadMedia = async (newSrc) => {
    if (dash) {
      dash.reset();
      dash = null;
    }

    if (!config.force && html5CanPlay(newSrc)) {
      h5Player.loadMedia(newSrc);
      return;
    }

    try {
      const dashjs = await getSDK(config.version);
      dash = dashjs.MediaPlayer().create();
      dash.initialize(await h5Player.getRef(), newSrc);
      dash.getDebug().setLogToBrowserConsole(config.debug);
      dash.on(dashjs.MediaPlayerEvents.ERROR, e => dispatch(ProviderEvent.ERROR, e));
    } catch (e) { dispatch(ProviderEvent.ERROR, e); }
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  onDestroy(() => {
    if (dash) dash.reset();
    dash = null;
  });

  // --------------------------------------------------------------
  // Getters + Setters
  // --------------------------------------------------------------

  // Forward all events to the Html5 provider.
  export const getMediaType = async () => h5Player.getMediaType();
  export const getCurrentTime = async () => h5Player.getCurrentTime();
  export const getEl = async () => h5Player.getEl();
  export const getInternalPlayer = async () => (dash || h5Player.getInternalPlayer());
  export const getDuration = async () => h5Player.getDuration();
  export const getBuffered = async () => h5Player.getBuffered();
  export const getQualities = async () => h5Player.getQualities();
  export const getPlaybackRates = async () => h5Player.getPlaybackRates();
  export const isPiPSupported = async () => h5Player.isPiPSupported();
  export const setCurrentTime = newTime => { h5Player.setCurrentTime(newTime); };
  export const setMuted = isMuted => { h5Player.setMuted(isMuted); };
  export const setPaused = isPaused => { h5Player.setPaused(isPaused); };
  export const setVolume = newVolume => { h5Player.setVolume(newVolume); };
  export const setPlaybackRate = newPlaybackRate => { h5Player.setPlaybackRate(newPlaybackRate); };
  export const setPiP = isActive => { h5Player.setPiP(isActive); };
  export const setCrossOrigin = option => { h5Player.setCrossOrigin(option); };
  export const setQuality = newQuality => { h5Player.setQuality(newQuality); };
</script>