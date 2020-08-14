/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import Vue, { PropOptions } from 'vue';
import { createCommonRender, createCommonMethod } from './vue-component-lib/utils';

import type { Components } from '@vime/core';




const customElementTags: string[] = [
 'vime-audio',
 'vime-caption-control',
 'vime-captions',
 'vime-click-to-play',
 'vime-control',
 'vime-control-group',
 'vime-control-spacer',
 'vime-controls',
 'vime-current-time',
 'vime-dailymotion',
 'vime-dash',
 'vime-default-controls',
 'vime-default-settings',
 'vime-default-ui',
 'vime-embed',
 'vime-end-time',
 'vime-faketube',
 'vime-file',
 'vime-fullscreen-control',
 'vime-hls',
 'vime-icon',
 'vime-icons',
 'vime-live-indicator',
 'vime-menu',
 'vime-menu-item',
 'vime-menu-radio',
 'vime-menu-radio-group',
 'vime-mute-control',
 'vime-pip-control',
 'vime-playback-control',
 'vime-player',
 'vime-poster',
 'vime-scrim',
 'vime-scrubber-control',
 'vime-settings',
 'vime-settings-control',
 'vime-slider',
 'vime-spinner',
 'vime-submenu',
 'vime-time',
 'vime-time-progress',
 'vime-tooltip',
 'vime-ui',
 'vime-video',
 'vime-vimeo',
 'vime-volume-control',
 'vime-youtube',
];
Vue.config.ignoredElements = [...Vue.config.ignoredElements, ...customElementTags];


export const VimeAudio = /*@__PURE__*/ Vue.extend({

  props: {
    willAttach: {} as PropOptions<Components.VimeAudio['willAttach']>,
    crossOrigin: {} as PropOptions<Components.VimeAudio['crossOrigin']>,
    preload: {} as PropOptions<Components.VimeAudio['preload']>,
    disableRemotePlayback: {} as PropOptions<Components.VimeAudio['disableRemotePlayback']>,
    mediaTitle: {} as PropOptions<Components.VimeAudio['mediaTitle']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeAudio['getAdapter'],
  },
  render: createCommonRender('vime-audio', []),
});


export const VimeCaptionControl = /*@__PURE__*/ Vue.extend({

  props: {
    showIcon: {} as PropOptions<Components.VimeCaptionControl['showIcon']>,
    hideIcon: {} as PropOptions<Components.VimeCaptionControl['hideIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimeCaptionControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimeCaptionControl['hideTooltip']>,
    scale: {} as PropOptions<Components.VimeCaptionControl['scale']>,
    keys: {} as PropOptions<Components.VimeCaptionControl['keys']>,
    currentCaption: {} as PropOptions<Components.VimeCaptionControl['currentCaption']>,
    isCaptionsActive: {} as PropOptions<Components.VimeCaptionControl['isCaptionsActive']>,
    i18n: {} as PropOptions<Components.VimeCaptionControl['i18n']>,
  },


  render: createCommonRender('vime-caption-control', []),
});


export const VimeCaptions = /*@__PURE__*/ Vue.extend({

  props: {
    hidden: {} as PropOptions<Components.VimeCaptions['hidden']>,
    controlsHeight: {} as PropOptions<Components.VimeCaptions['controlsHeight']>,
    isControlsActive: {} as PropOptions<Components.VimeCaptions['isControlsActive']>,
    isVideoView: {} as PropOptions<Components.VimeCaptions['isVideoView']>,
    playbackStarted: {} as PropOptions<Components.VimeCaptions['playbackStarted']>,
    textTracks: {} as PropOptions<Components.VimeCaptions['textTracks']>,
  },


  render: createCommonRender('vime-captions', ['trackChange', 'cuesChange']),
});


export const VimeClickToPlay = /*@__PURE__*/ Vue.extend({

  props: {
    useOnMobile: {} as PropOptions<Components.VimeClickToPlay['useOnMobile']>,
    paused: {} as PropOptions<Components.VimeClickToPlay['paused']>,
    isVideoView: {} as PropOptions<Components.VimeClickToPlay['isVideoView']>,
  },


  render: createCommonRender('vime-click-to-play', []),
});


export const VimeControl = /*@__PURE__*/ Vue.extend({

  props: {
    keys: {} as PropOptions<Components.VimeControl['keys']>,
    identifier: {} as PropOptions<Components.VimeControl['identifier']>,
    hidden: {} as PropOptions<Components.VimeControl['hidden']>,
    label: {} as PropOptions<Components.VimeControl['label']>,
    menu: {} as PropOptions<Components.VimeControl['menu']>,
    expanded: {} as PropOptions<Components.VimeControl['expanded']>,
    pressed: {} as PropOptions<Components.VimeControl['pressed']>,
    scale: {} as PropOptions<Components.VimeControl['scale']>,
    isTouch: {} as PropOptions<Components.VimeControl['isTouch']>,
  },


  render: createCommonRender('vime-control', ['interactionChange']),
});


export const VimeControlGroup = /*@__PURE__*/ Vue.extend({

  props: {
    space: {} as PropOptions<Components.VimeControlGroup['space']>,
  },


  render: createCommonRender('vime-control-group', []),
});


export const VimeControlSpacer = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('vime-control-spacer', []),
});


export const VimeControls = /*@__PURE__*/ Vue.extend({

  props: {
    hidden: {} as PropOptions<Components.VimeControls['hidden']>,
    fullWidth: {} as PropOptions<Components.VimeControls['fullWidth']>,
    fullHeight: {} as PropOptions<Components.VimeControls['fullHeight']>,
    direction: {} as PropOptions<Components.VimeControls['direction']>,
    align: {} as PropOptions<Components.VimeControls['align']>,
    justify: {} as PropOptions<Components.VimeControls['justify']>,
    pin: {} as PropOptions<Components.VimeControls['pin']>,
    activeDuration: {} as PropOptions<Components.VimeControls['activeDuration']>,
    waitForPlaybackStart: {} as PropOptions<Components.VimeControls['waitForPlaybackStart']>,
    hideWhenPaused: {} as PropOptions<Components.VimeControls['hideWhenPaused']>,
    hideOnMouseLeave: {} as PropOptions<Components.VimeControls['hideOnMouseLeave']>,
    isAudioView: {} as PropOptions<Components.VimeControls['isAudioView']>,
    isSettingsActive: {} as PropOptions<Components.VimeControls['isSettingsActive']>,
    playbackReady: {} as PropOptions<Components.VimeControls['playbackReady']>,
    isControlsActive: {} as PropOptions<Components.VimeControls['isControlsActive']>,
    paused: {} as PropOptions<Components.VimeControls['paused']>,
    playbackStarted: {} as PropOptions<Components.VimeControls['playbackStarted']>,
  },


  render: createCommonRender('vime-controls', []),
});


export const VimeCurrentTime = /*@__PURE__*/ Vue.extend({

  props: {
    currentTime: {} as PropOptions<Components.VimeCurrentTime['currentTime']>,
    i18n: {} as PropOptions<Components.VimeCurrentTime['i18n']>,
    alwaysShowHours: {} as PropOptions<Components.VimeCurrentTime['alwaysShowHours']>,
  },


  render: createCommonRender('vime-current-time', []),
});


export const VimeDailymotion = /*@__PURE__*/ Vue.extend({

  props: {
    videoId: {} as PropOptions<Components.VimeDailymotion['videoId']>,
    shouldAutoplayQueue: {} as PropOptions<Components.VimeDailymotion['shouldAutoplayQueue']>,
    showUpNextQueue: {} as PropOptions<Components.VimeDailymotion['showUpNextQueue']>,
    showShareButtons: {} as PropOptions<Components.VimeDailymotion['showShareButtons']>,
    color: {} as PropOptions<Components.VimeDailymotion['color']>,
    syndication: {} as PropOptions<Components.VimeDailymotion['syndication']>,
    showDailymotionLogo: {} as PropOptions<Components.VimeDailymotion['showDailymotionLogo']>,
    showVideoInfo: {} as PropOptions<Components.VimeDailymotion['showVideoInfo']>,
    language: {} as PropOptions<Components.VimeDailymotion['language']>,
    autoplay: {} as PropOptions<Components.VimeDailymotion['autoplay']>,
    controls: {} as PropOptions<Components.VimeDailymotion['controls']>,
    debug: {} as PropOptions<Components.VimeDailymotion['debug']>,
    loop: {} as PropOptions<Components.VimeDailymotion['loop']>,
    muted: {} as PropOptions<Components.VimeDailymotion['muted']>,
    playsinline: {} as PropOptions<Components.VimeDailymotion['playsinline']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeDailymotion['getAdapter'],
  },
  render: createCommonRender('vime-dailymotion', ['vLoadStart']),
});


export const VimeDash = /*@__PURE__*/ Vue.extend({

  props: {
    src: {} as PropOptions<Components.VimeDash['src']>,
    version: {} as PropOptions<Components.VimeDash['version']>,
    config: {} as PropOptions<Components.VimeDash['config']>,
    autoplay: {} as PropOptions<Components.VimeDash['autoplay']>,
    crossOrigin: {} as PropOptions<Components.VimeDash['crossOrigin']>,
    preload: {} as PropOptions<Components.VimeDash['preload']>,
    poster: {} as PropOptions<Components.VimeDash['poster']>,
    controlsList: {} as PropOptions<Components.VimeDash['controlsList']>,
    autoPiP: {} as PropOptions<Components.VimeDash['autoPiP']>,
    disablePiP: {} as PropOptions<Components.VimeDash['disablePiP']>,
    disableRemotePlayback: {} as PropOptions<Components.VimeDash['disableRemotePlayback']>,
    mediaTitle: {} as PropOptions<Components.VimeDash['mediaTitle']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeDash['getAdapter'],
  },
  render: createCommonRender('vime-dash', ['vLoadStart']),
});


export const VimeDefaultControls = /*@__PURE__*/ Vue.extend({

  props: {
    activeDuration: {} as PropOptions<Components.VimeDefaultControls['activeDuration']>,
    waitForPlaybackStart: {} as PropOptions<Components.VimeDefaultControls['waitForPlaybackStart']>,
    hideWhenPaused: {} as PropOptions<Components.VimeDefaultControls['hideWhenPaused']>,
    hideOnMouseLeave: {} as PropOptions<Components.VimeDefaultControls['hideOnMouseLeave']>,
    isMobile: {} as PropOptions<Components.VimeDefaultControls['isMobile']>,
    isLive: {} as PropOptions<Components.VimeDefaultControls['isLive']>,
    isAudioView: {} as PropOptions<Components.VimeDefaultControls['isAudioView']>,
    isVideoView: {} as PropOptions<Components.VimeDefaultControls['isVideoView']>,
  },


  render: createCommonRender('vime-default-controls', []),
});


export const VimeDefaultSettings = /*@__PURE__*/ Vue.extend({

  props: {
    i18n: {} as PropOptions<Components.VimeDefaultSettings['i18n']>,
    playbackRate: {} as PropOptions<Components.VimeDefaultSettings['playbackRate']>,
    playbackRates: {} as PropOptions<Components.VimeDefaultSettings['playbackRates']>,
    playbackQuality: {} as PropOptions<Components.VimeDefaultSettings['playbackQuality']>,
    playbackQualities: {} as PropOptions<Components.VimeDefaultSettings['playbackQualities']>,
    isCaptionsActive: {} as PropOptions<Components.VimeDefaultSettings['isCaptionsActive']>,
    currentCaption: {} as PropOptions<Components.VimeDefaultSettings['currentCaption']>,
    textTracks: {} as PropOptions<Components.VimeDefaultSettings['textTracks']>,
  },


  render: createCommonRender('vime-default-settings', []),
});


export const VimeDefaultUi = /*@__PURE__*/ Vue.extend({



  render: createCommonRender('vime-default-ui', []),
});


export const VimeEmbed = /*@__PURE__*/ Vue.extend({

  props: {
    embedSrc: {} as PropOptions<Components.VimeEmbed['embedSrc']>,
    mediaTitle: {} as PropOptions<Components.VimeEmbed['mediaTitle']>,
    params: {} as PropOptions<Components.VimeEmbed['params']>,
    origin: {} as PropOptions<Components.VimeEmbed['origin']>,
    preconnections: {} as PropOptions<Components.VimeEmbed['preconnections']>,
    decoder: {} as PropOptions<Components.VimeEmbed['decoder']>,
  },


  methods: {
    postMessage: createCommonMethod('postMessage') as Components.VimeEmbed['postMessage'],
  },
  render: createCommonRender('vime-embed', ['embedSrcChange', 'embedMessage', 'embedLoaded']),
});


export const VimeEndTime = /*@__PURE__*/ Vue.extend({

  props: {
    duration: {} as PropOptions<Components.VimeEndTime['duration']>,
    i18n: {} as PropOptions<Components.VimeEndTime['i18n']>,
    alwaysShowHours: {} as PropOptions<Components.VimeEndTime['alwaysShowHours']>,
  },


  render: createCommonRender('vime-end-time', []),
});


export const VimeFaketube = /*@__PURE__*/ Vue.extend({

  props: {
    language: {} as PropOptions<Components.VimeFaketube['language']>,
    autoplay: {} as PropOptions<Components.VimeFaketube['autoplay']>,
    controls: {} as PropOptions<Components.VimeFaketube['controls']>,
    debug: {} as PropOptions<Components.VimeFaketube['debug']>,
    loop: {} as PropOptions<Components.VimeFaketube['loop']>,
    muted: {} as PropOptions<Components.VimeFaketube['muted']>,
    playsinline: {} as PropOptions<Components.VimeFaketube['playsinline']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeFaketube['getAdapter'],
    dispatchLoadStart: createCommonMethod('dispatchLoadStart') as Components.VimeFaketube['dispatchLoadStart'],
    dispatchStateChange: createCommonMethod('dispatchStateChange') as Components.VimeFaketube['dispatchStateChange'],
  },
  render: createCommonRender('vime-faketube', ['vLoadStart']),
});


export const VimeFile = /*@__PURE__*/ Vue.extend({

  props: {
    willAttach: {} as PropOptions<Components.VimeFile['willAttach']>,
    crossOrigin: {} as PropOptions<Components.VimeFile['crossOrigin']>,
    preload: {} as PropOptions<Components.VimeFile['preload']>,
    poster: {} as PropOptions<Components.VimeFile['poster']>,
    mediaTitle: {} as PropOptions<Components.VimeFile['mediaTitle']>,
    controlsList: {} as PropOptions<Components.VimeFile['controlsList']>,
    autoPiP: {} as PropOptions<Components.VimeFile['autoPiP']>,
    disablePiP: {} as PropOptions<Components.VimeFile['disablePiP']>,
    disableRemotePlayback: {} as PropOptions<Components.VimeFile['disableRemotePlayback']>,
    viewType: {} as PropOptions<Components.VimeFile['viewType']>,
    playbackRates: {} as PropOptions<Components.VimeFile['playbackRates']>,
    language: {} as PropOptions<Components.VimeFile['language']>,
    autoplay: {} as PropOptions<Components.VimeFile['autoplay']>,
    controls: {} as PropOptions<Components.VimeFile['controls']>,
    debug: {} as PropOptions<Components.VimeFile['debug']>,
    loop: {} as PropOptions<Components.VimeFile['loop']>,
    muted: {} as PropOptions<Components.VimeFile['muted']>,
    playsinline: {} as PropOptions<Components.VimeFile['playsinline']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeFile['getAdapter'],
  },
  render: createCommonRender('vime-file', ['vLoadStart']),
});


export const VimeFullscreenControl = /*@__PURE__*/ Vue.extend({

  props: {
    enterIcon: {} as PropOptions<Components.VimeFullscreenControl['enterIcon']>,
    exitIcon: {} as PropOptions<Components.VimeFullscreenControl['exitIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimeFullscreenControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimeFullscreenControl['hideTooltip']>,
    scale: {} as PropOptions<Components.VimeFullscreenControl['scale']>,
    keys: {} as PropOptions<Components.VimeFullscreenControl['keys']>,
    isFullscreenActive: {} as PropOptions<Components.VimeFullscreenControl['isFullscreenActive']>,
    i18n: {} as PropOptions<Components.VimeFullscreenControl['i18n']>,
    playbackReady: {} as PropOptions<Components.VimeFullscreenControl['playbackReady']>,
  },


  render: createCommonRender('vime-fullscreen-control', []),
});


export const VimeHls = /*@__PURE__*/ Vue.extend({

  props: {
    version: {} as PropOptions<Components.VimeHls['version']>,
    config: {} as PropOptions<Components.VimeHls['config']>,
    crossOrigin: {} as PropOptions<Components.VimeHls['crossOrigin']>,
    preload: {} as PropOptions<Components.VimeHls['preload']>,
    poster: {} as PropOptions<Components.VimeHls['poster']>,
    controlsList: {} as PropOptions<Components.VimeHls['controlsList']>,
    autoPiP: {} as PropOptions<Components.VimeHls['autoPiP']>,
    disablePiP: {} as PropOptions<Components.VimeHls['disablePiP']>,
    disableRemotePlayback: {} as PropOptions<Components.VimeHls['disableRemotePlayback']>,
    mediaTitle: {} as PropOptions<Components.VimeHls['mediaTitle']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeHls['getAdapter'],
  },
  render: createCommonRender('vime-hls', ['vLoadStart']),
});


export const VimeIcon = /*@__PURE__*/ Vue.extend({

  props: {
    href: {} as PropOptions<Components.VimeIcon['href']>,
    color: {} as PropOptions<Components.VimeIcon['color']>,
    scale: {} as PropOptions<Components.VimeIcon['scale']>,
    opacity: {} as PropOptions<Components.VimeIcon['opacity']>,
  },


  render: createCommonRender('vime-icon', []),
});


export const VimeIcons = /*@__PURE__*/ Vue.extend({

  props: {
    href: {} as PropOptions<Components.VimeIcons['href']>,
  },


  render: createCommonRender('vime-icons', []),
});


export const VimeLiveIndicator = /*@__PURE__*/ Vue.extend({

  props: {
    isLive: {} as PropOptions<Components.VimeLiveIndicator['isLive']>,
    i18n: {} as PropOptions<Components.VimeLiveIndicator['i18n']>,
  },


  render: createCommonRender('vime-live-indicator', []),
});


export const VimeMenu = /*@__PURE__*/ Vue.extend({

  props: {
    active: {} as PropOptions<Components.VimeMenu['active']>,
    identifier: {} as PropOptions<Components.VimeMenu['identifier']>,
    controller: {} as PropOptions<Components.VimeMenu['controller']>,
  },


  methods: {
    getController: createCommonMethod('getController') as Components.VimeMenu['getController'],
    getFocusedMenuItem: createCommonMethod('getFocusedMenuItem') as Components.VimeMenu['getFocusedMenuItem'],
    focusOnOpen: createCommonMethod('focusOnOpen') as Components.VimeMenu['focusOnOpen'],
  },
  render: createCommonRender('vime-menu', ['open', 'close', 'menuItemsChange', 'focusedMenuItem']),
});


export const VimeMenuItem = /*@__PURE__*/ Vue.extend({

  props: {
    identifier: {} as PropOptions<Components.VimeMenuItem['identifier']>,
    hidden: {} as PropOptions<Components.VimeMenuItem['hidden']>,
    label: {} as PropOptions<Components.VimeMenuItem['label']>,
    menu: {} as PropOptions<Components.VimeMenuItem['menu']>,
    expanded: {} as PropOptions<Components.VimeMenuItem['expanded']>,
    checked: {} as PropOptions<Components.VimeMenuItem['checked']>,
    hint: {} as PropOptions<Components.VimeMenuItem['hint']>,
    badge: {} as PropOptions<Components.VimeMenuItem['badge']>,
    checkedIcon: {} as PropOptions<Components.VimeMenuItem['checkedIcon']>,
    isTouch: {} as PropOptions<Components.VimeMenuItem['isTouch']>,
  },


  render: createCommonRender('vime-menu-item', []),
});


export const VimeMenuRadio = /*@__PURE__*/ Vue.extend({

  props: {
    label: {} as PropOptions<Components.VimeMenuRadio['label']>,
    value: {} as PropOptions<Components.VimeMenuRadio['value']>,
    checked: {} as PropOptions<Components.VimeMenuRadio['checked']>,
    badge: {} as PropOptions<Components.VimeMenuRadio['badge']>,
    checkedIcon: {} as PropOptions<Components.VimeMenuRadio['checkedIcon']>,
  },


  render: createCommonRender('vime-menu-radio', ['check']),
});


export const VimeMenuRadioGroup = /*@__PURE__*/ Vue.extend({

  props: {
    value: {} as PropOptions<Components.VimeMenuRadioGroup['value']>,
  },


  render: createCommonRender('vime-menu-radio-group', ['check']),
});


export const VimeMuteControl = /*@__PURE__*/ Vue.extend({

  props: {
    lowVolumeIcon: {} as PropOptions<Components.VimeMuteControl['lowVolumeIcon']>,
    highVolumeIcon: {} as PropOptions<Components.VimeMuteControl['highVolumeIcon']>,
    mutedIcon: {} as PropOptions<Components.VimeMuteControl['mutedIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimeMuteControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimeMuteControl['hideTooltip']>,
    scale: {} as PropOptions<Components.VimeMuteControl['scale']>,
    keys: {} as PropOptions<Components.VimeMuteControl['keys']>,
    volume: {} as PropOptions<Components.VimeMuteControl['volume']>,
    muted: {} as PropOptions<Components.VimeMuteControl['muted']>,
    i18n: {} as PropOptions<Components.VimeMuteControl['i18n']>,
  },


  render: createCommonRender('vime-mute-control', []),
});


export const VimePipControl = /*@__PURE__*/ Vue.extend({

  props: {
    enterIcon: {} as PropOptions<Components.VimePipControl['enterIcon']>,
    exitIcon: {} as PropOptions<Components.VimePipControl['exitIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimePipControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimePipControl['hideTooltip']>,
    keys: {} as PropOptions<Components.VimePipControl['keys']>,
    scale: {} as PropOptions<Components.VimePipControl['scale']>,
    isPiPActive: {} as PropOptions<Components.VimePipControl['isPiPActive']>,
    i18n: {} as PropOptions<Components.VimePipControl['i18n']>,
    playbackReady: {} as PropOptions<Components.VimePipControl['playbackReady']>,
  },


  render: createCommonRender('vime-pip-control', []),
});


export const VimePlaybackControl = /*@__PURE__*/ Vue.extend({

  props: {
    playIcon: {} as PropOptions<Components.VimePlaybackControl['playIcon']>,
    pauseIcon: {} as PropOptions<Components.VimePlaybackControl['pauseIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimePlaybackControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimePlaybackControl['hideTooltip']>,
    scale: {} as PropOptions<Components.VimePlaybackControl['scale']>,
    keys: {} as PropOptions<Components.VimePlaybackControl['keys']>,
    paused: {} as PropOptions<Components.VimePlaybackControl['paused']>,
    i18n: {} as PropOptions<Components.VimePlaybackControl['i18n']>,
  },


  render: createCommonRender('vime-playback-control', []),
});


export const VimePlayer = /*@__PURE__*/ Vue.extend({

  props: {
    paused: {} as PropOptions<Components.VimePlayer['paused']>,
    playing: {} as PropOptions<Components.VimePlayer['playing']>,
    duration: {} as PropOptions<Components.VimePlayer['duration']>,
    mediaTitle: {} as PropOptions<Components.VimePlayer['mediaTitle']>,
    currentSrc: {} as PropOptions<Components.VimePlayer['currentSrc']>,
    currentPoster: {} as PropOptions<Components.VimePlayer['currentPoster']>,
    currentTime: {} as PropOptions<Components.VimePlayer['currentTime']>,
    autoplay: {} as PropOptions<Components.VimePlayer['autoplay']>,
    playbackReady: {} as PropOptions<Components.VimePlayer['playbackReady']>,
    loop: {} as PropOptions<Components.VimePlayer['loop']>,
    muted: {} as PropOptions<Components.VimePlayer['muted']>,
    buffered: {} as PropOptions<Components.VimePlayer['buffered']>,
    playbackRate: {} as PropOptions<Components.VimePlayer['playbackRate']>,
    playbackRates: {} as PropOptions<Components.VimePlayer['playbackRates']>,
    playbackQuality: {} as PropOptions<Components.VimePlayer['playbackQuality']>,
    playbackQualities: {} as PropOptions<Components.VimePlayer['playbackQualities']>,
    seeking: {} as PropOptions<Components.VimePlayer['seeking']>,
    debug: {} as PropOptions<Components.VimePlayer['debug']>,
    playbackStarted: {} as PropOptions<Components.VimePlayer['playbackStarted']>,
    playbackEnded: {} as PropOptions<Components.VimePlayer['playbackEnded']>,
    buffering: {} as PropOptions<Components.VimePlayer['buffering']>,
    controls: {} as PropOptions<Components.VimePlayer['controls']>,
    isControlsActive: {} as PropOptions<Components.VimePlayer['isControlsActive']>,
    errors: {} as PropOptions<Components.VimePlayer['errors']>,
    textTracks: {} as PropOptions<Components.VimePlayer['textTracks']>,
    currentCaption: {} as PropOptions<Components.VimePlayer['currentCaption']>,
    isCaptionsActive: {} as PropOptions<Components.VimePlayer['isCaptionsActive']>,
    isSettingsActive: {} as PropOptions<Components.VimePlayer['isSettingsActive']>,
    volume: {} as PropOptions<Components.VimePlayer['volume']>,
    isFullscreenActive: {} as PropOptions<Components.VimePlayer['isFullscreenActive']>,
    aspectRatio: {} as PropOptions<Components.VimePlayer['aspectRatio']>,
    viewType: {} as PropOptions<Components.VimePlayer['viewType']>,
    isAudioView: {} as PropOptions<Components.VimePlayer['isAudioView']>,
    isVideoView: {} as PropOptions<Components.VimePlayer['isVideoView']>,
    mediaType: {} as PropOptions<Components.VimePlayer['mediaType']>,
    isAudio: {} as PropOptions<Components.VimePlayer['isAudio']>,
    isVideo: {} as PropOptions<Components.VimePlayer['isVideo']>,
    isLive: {} as PropOptions<Components.VimePlayer['isLive']>,
    isMobile: {} as PropOptions<Components.VimePlayer['isMobile']>,
    isTouch: {} as PropOptions<Components.VimePlayer['isTouch']>,
    isPiPActive: {} as PropOptions<Components.VimePlayer['isPiPActive']>,
    autopause: {} as PropOptions<Components.VimePlayer['autopause']>,
    playsinline: {} as PropOptions<Components.VimePlayer['playsinline']>,
    language: {} as PropOptions<Components.VimePlayer['language']>,
    translations: {} as PropOptions<Components.VimePlayer['translations']>,
    languages: {} as PropOptions<Components.VimePlayer['languages']>,
    i18n: {} as PropOptions<Components.VimePlayer['i18n']>,
    noSkeleton: {} as PropOptions<Components.VimePlayer['noSkeleton']>,
  },


  methods: {
    getProvider: createCommonMethod('getProvider') as Components.VimePlayer['getProvider'],
    getAdapter: createCommonMethod('getAdapter') as Components.VimePlayer['getAdapter'],
    play: createCommonMethod('play') as Components.VimePlayer['play'],
    pause: createCommonMethod('pause') as Components.VimePlayer['pause'],
    canPlay: createCommonMethod('canPlay') as Components.VimePlayer['canPlay'],
    canAutoplay: createCommonMethod('canAutoplay') as Components.VimePlayer['canAutoplay'],
    canMutedAutoplay: createCommonMethod('canMutedAutoplay') as Components.VimePlayer['canMutedAutoplay'],
    canSetPlaybackRate: createCommonMethod('canSetPlaybackRate') as Components.VimePlayer['canSetPlaybackRate'],
    canSetPlaybackQuality: createCommonMethod('canSetPlaybackQuality') as Components.VimePlayer['canSetPlaybackQuality'],
    canSetFullscreen: createCommonMethod('canSetFullscreen') as Components.VimePlayer['canSetFullscreen'],
    enterFullscreen: createCommonMethod('enterFullscreen') as Components.VimePlayer['enterFullscreen'],
    exitFullscreen: createCommonMethod('exitFullscreen') as Components.VimePlayer['exitFullscreen'],
    canSetPiP: createCommonMethod('canSetPiP') as Components.VimePlayer['canSetPiP'],
    enterPiP: createCommonMethod('enterPiP') as Components.VimePlayer['enterPiP'],
    exitPiP: createCommonMethod('exitPiP') as Components.VimePlayer['exitPiP'],
    extendLanguage: createCommonMethod('extendLanguage') as Components.VimePlayer['extendLanguage'],
    callAdapter: createCommonMethod('callAdapter') as Components.VimePlayer['callAdapter'],
    queuePropChange: createCommonMethod('queuePropChange') as Components.VimePlayer['queuePropChange'],
    queueStateChange: createCommonMethod('queueStateChange') as Components.VimePlayer['queueStateChange'],
  },
  render: createCommonRender('vime-player', ['vPausedChange', 'vPlay', 'vPlayingChange', 'vSeekingChange', 'vSeeked', 'vBufferingChange', 'vDurationChange', 'vCurrentTimeChange', 'vPlaybackReady', 'vPlaybackStarted', 'vPlaybackEnded', 'vBufferedChange', 'vTextTracksChange', 'vErrorsChange', 'vLoadStart', 'vCurrentSrcChange', 'vCurrentPosterChange', 'vMediaTitleChange', 'vControlsChange', 'vPlaybackRateChange', 'vPlaybackRatesChange', 'vPlaybackQualityChange', 'vPlaybackQualitiesChange', 'vMutedChange', 'vVolumeChange', 'vViewTypeChange', 'vMediaTypeChange', 'vLiveChange', 'vTouchChange', 'vLanguageChange', 'vLanguagesChange', 'vFullscreenChange', 'vPiPChange']),
});


export const VimePoster = /*@__PURE__*/ Vue.extend({

  props: {
    fit: {} as PropOptions<Components.VimePoster['fit']>,
    isVideoView: {} as PropOptions<Components.VimePoster['isVideoView']>,
    currentPoster: {} as PropOptions<Components.VimePoster['currentPoster']>,
    mediaTitle: {} as PropOptions<Components.VimePoster['mediaTitle']>,
    playbackStarted: {} as PropOptions<Components.VimePoster['playbackStarted']>,
  },


  render: createCommonRender('vime-poster', ['loaded', 'willShow', 'willHide']),
});


export const VimeScrim = /*@__PURE__*/ Vue.extend({

  props: {
    gradient: {} as PropOptions<Components.VimeScrim['gradient']>,
    isVideoView: {} as PropOptions<Components.VimeScrim['isVideoView']>,
    isControlsActive: {} as PropOptions<Components.VimeScrim['isControlsActive']>,
  },


  render: createCommonRender('vime-scrim', []),
});


export const VimeScrubberControl = /*@__PURE__*/ Vue.extend({

  props: {
    alwaysShowHours: {} as PropOptions<Components.VimeScrubberControl['alwaysShowHours']>,
    hideTooltip: {} as PropOptions<Components.VimeScrubberControl['hideTooltip']>,
    currentTime: {} as PropOptions<Components.VimeScrubberControl['currentTime']>,
    duration: {} as PropOptions<Components.VimeScrubberControl['duration']>,
    noKeyboard: {} as PropOptions<Components.VimeScrubberControl['noKeyboard']>,
    buffering: {} as PropOptions<Components.VimeScrubberControl['buffering']>,
    buffered: {} as PropOptions<Components.VimeScrubberControl['buffered']>,
    i18n: {} as PropOptions<Components.VimeScrubberControl['i18n']>,
  },


  render: createCommonRender('vime-scrubber-control', []),
});


export const VimeSettings = /*@__PURE__*/ Vue.extend({

  props: {
    controlsHeight: {} as PropOptions<Components.VimeSettings['controlsHeight']>,
    active: {} as PropOptions<Components.VimeSettings['active']>,
    isMobile: {} as PropOptions<Components.VimeSettings['isMobile']>,
    isAudioView: {} as PropOptions<Components.VimeSettings['isAudioView']>,
  },


  methods: {
    setController: createCommonMethod('setController') as Components.VimeSettings['setController'],
  },
  render: createCommonRender('vime-settings', []),
});


export const VimeSettingsControl = /*@__PURE__*/ Vue.extend({

  props: {
    icon: {} as PropOptions<Components.VimeSettingsControl['icon']>,
    tooltipDirection: {} as PropOptions<Components.VimeSettingsControl['tooltipDirection']>,
    menu: {} as PropOptions<Components.VimeSettingsControl['menu']>,
    expanded: {} as PropOptions<Components.VimeSettingsControl['expanded']>,
    i18n: {} as PropOptions<Components.VimeSettingsControl['i18n']>,
  },


  render: createCommonRender('vime-settings-control', []),
});


export const VimeSlider = /*@__PURE__*/ Vue.extend({

  props: {
    step: {} as PropOptions<Components.VimeSlider['step']>,
    min: {} as PropOptions<Components.VimeSlider['min']>,
    max: {} as PropOptions<Components.VimeSlider['max']>,
    value: {} as PropOptions<Components.VimeSlider['value']>,
    valueText: {} as PropOptions<Components.VimeSlider['valueText']>,
    label: {} as PropOptions<Components.VimeSlider['label']>,
  },


  render: createCommonRender('vime-slider', ['valueChange']),
});


export const VimeSpinner = /*@__PURE__*/ Vue.extend({

  props: {
    isVideoView: {} as PropOptions<Components.VimeSpinner['isVideoView']>,
    buffering: {} as PropOptions<Components.VimeSpinner['buffering']>,
  },


  render: createCommonRender('vime-spinner', ['willShow', 'willHide']),
});


export const VimeSubmenu = /*@__PURE__*/ Vue.extend({

  props: {
    label: {} as PropOptions<Components.VimeSubmenu['label']>,
    hidden: {} as PropOptions<Components.VimeSubmenu['hidden']>,
    hint: {} as PropOptions<Components.VimeSubmenu['hint']>,
    active: {} as PropOptions<Components.VimeSubmenu['active']>,
  },


  render: createCommonRender('vime-submenu', []),
});


export const VimeTime = /*@__PURE__*/ Vue.extend({

  props: {
    label: {} as PropOptions<Components.VimeTime['label']>,
    seconds: {} as PropOptions<Components.VimeTime['seconds']>,
    alwaysShowHours: {} as PropOptions<Components.VimeTime['alwaysShowHours']>,
  },


  render: createCommonRender('vime-time', []),
});


export const VimeTimeProgress = /*@__PURE__*/ Vue.extend({

  props: {
    separator: {} as PropOptions<Components.VimeTimeProgress['separator']>,
    alwaysShowHours: {} as PropOptions<Components.VimeTimeProgress['alwaysShowHours']>,
  },


  render: createCommonRender('vime-time-progress', []),
});


export const VimeTooltip = /*@__PURE__*/ Vue.extend({

  props: {
    hidden: {} as PropOptions<Components.VimeTooltip['hidden']>,
    active: {} as PropOptions<Components.VimeTooltip['active']>,
    position: {} as PropOptions<Components.VimeTooltip['position']>,
    direction: {} as PropOptions<Components.VimeTooltip['direction']>,
    isTouch: {} as PropOptions<Components.VimeTooltip['isTouch']>,
  },


  render: createCommonRender('vime-tooltip', []),
});


export const VimeUi = /*@__PURE__*/ Vue.extend({

  props: {
    isVideoView: {} as PropOptions<Components.VimeUi['isVideoView']>,
    playsinline: {} as PropOptions<Components.VimeUi['playsinline']>,
    isFullscreenActive: {} as PropOptions<Components.VimeUi['isFullscreenActive']>,
  },


  render: createCommonRender('vime-ui', []),
});


export const VimeVideo = /*@__PURE__*/ Vue.extend({

  props: {
    willAttach: {} as PropOptions<Components.VimeVideo['willAttach']>,
    crossOrigin: {} as PropOptions<Components.VimeVideo['crossOrigin']>,
    preload: {} as PropOptions<Components.VimeVideo['preload']>,
    poster: {} as PropOptions<Components.VimeVideo['poster']>,
    controlsList: {} as PropOptions<Components.VimeVideo['controlsList']>,
    autoPiP: {} as PropOptions<Components.VimeVideo['autoPiP']>,
    disablePiP: {} as PropOptions<Components.VimeVideo['disablePiP']>,
    disableRemotePlayback: {} as PropOptions<Components.VimeVideo['disableRemotePlayback']>,
    mediaTitle: {} as PropOptions<Components.VimeVideo['mediaTitle']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeVideo['getAdapter'],
  },
  render: createCommonRender('vime-video', []),
});


export const VimeVimeo = /*@__PURE__*/ Vue.extend({

  props: {
    videoId: {} as PropOptions<Components.VimeVimeo['videoId']>,
    byline: {} as PropOptions<Components.VimeVimeo['byline']>,
    color: {} as PropOptions<Components.VimeVimeo['color']>,
    portrait: {} as PropOptions<Components.VimeVimeo['portrait']>,
    language: {} as PropOptions<Components.VimeVimeo['language']>,
    autoplay: {} as PropOptions<Components.VimeVimeo['autoplay']>,
    controls: {} as PropOptions<Components.VimeVimeo['controls']>,
    debug: {} as PropOptions<Components.VimeVimeo['debug']>,
    loop: {} as PropOptions<Components.VimeVimeo['loop']>,
    muted: {} as PropOptions<Components.VimeVimeo['muted']>,
    playsinline: {} as PropOptions<Components.VimeVimeo['playsinline']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeVimeo['getAdapter'],
  },
  render: createCommonRender('vime-vimeo', ['vLoadStart']),
});


export const VimeVolumeControl = /*@__PURE__*/ Vue.extend({

  props: {
    lowVolumeIcon: {} as PropOptions<Components.VimeVolumeControl['lowVolumeIcon']>,
    highVolumeIcon: {} as PropOptions<Components.VimeVolumeControl['highVolumeIcon']>,
    mutedIcon: {} as PropOptions<Components.VimeVolumeControl['mutedIcon']>,
    tooltipDirection: {} as PropOptions<Components.VimeVolumeControl['tooltipDirection']>,
    hideTooltip: {} as PropOptions<Components.VimeVolumeControl['hideTooltip']>,
    muteKeys: {} as PropOptions<Components.VimeVolumeControl['muteKeys']>,
    noKeyboard: {} as PropOptions<Components.VimeVolumeControl['noKeyboard']>,
    muted: {} as PropOptions<Components.VimeVolumeControl['muted']>,
    volume: {} as PropOptions<Components.VimeVolumeControl['volume']>,
    isMobile: {} as PropOptions<Components.VimeVolumeControl['isMobile']>,
    i18n: {} as PropOptions<Components.VimeVolumeControl['i18n']>,
  },


  render: createCommonRender('vime-volume-control', []),
});


export const VimeYoutube = /*@__PURE__*/ Vue.extend({

  props: {
    cookies: {} as PropOptions<Components.VimeYoutube['cookies']>,
    videoId: {} as PropOptions<Components.VimeYoutube['videoId']>,
    showFullscreenControl: {} as PropOptions<Components.VimeYoutube['showFullscreenControl']>,
    language: {} as PropOptions<Components.VimeYoutube['language']>,
    autoplay: {} as PropOptions<Components.VimeYoutube['autoplay']>,
    controls: {} as PropOptions<Components.VimeYoutube['controls']>,
    debug: {} as PropOptions<Components.VimeYoutube['debug']>,
    loop: {} as PropOptions<Components.VimeYoutube['loop']>,
    muted: {} as PropOptions<Components.VimeYoutube['muted']>,
    playsinline: {} as PropOptions<Components.VimeYoutube['playsinline']>,
  },


  methods: {
    getAdapter: createCommonMethod('getAdapter') as Components.VimeYoutube['getAdapter'],
  },
  render: createCommonRender('vime-youtube', ['vLoadStart']),
});

