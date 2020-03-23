import { InteractiveView } from '../../../views';
import config from '../../../config';

import {
  Player, Html5Provider, YouTubeProvider,
  DailymotionProvider, VimeoProvider, Boot,
} from '@vime-js/player';

export default {
  title: 'Packages/Player/Components',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
};

const THEME = '#f76d82';
const EVENTS = config.Events.COMPLETE;
const PROVIDERS = [Html5Provider, YouTubeProvider, DailymotionProvider, VimeoProvider];

const VIDEO_BASE_PROPS = {
  Component: Player,
  poster: config.File.POSTER,
  theme: THEME,
  events: EVENTS,
  providers: PROVIDERS,
  plugins: [Boot],
  tracks: config.File.TRACKS,
};

export const Audio = () => ({
  Component: InteractiveView,
  props: {
    Component: Player,
    src: config.File.AUDIO,
    theme: THEME,
    providers: PROVIDERS,
    events: EVENTS,
    plugins: [Boot],
  },
});

export const Video = () => ({
  Component: InteractiveView,
  props: {
    ...VIDEO_BASE_PROPS,
    src: config.File.VIDEO,
  },
});

export const Youtube = () => ({
  Component: InteractiveView,
  props: {
    ...VIDEO_BASE_PROPS,
    src: config.YouTube.SRC,
  },
});

export const Dailymotion = () => ({
  Component: InteractiveView,
  props: {
    ...VIDEO_BASE_PROPS,
    src: config.Dailymotion.SRC,
  },
});

export const Vimeo = () => ({
  Component: InteractiveView,
  props: {
    ...VIDEO_BASE_PROPS,
    src: config.Vimeo.SRC,
  },
});

// TODO: HLS
// src: http://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
// poster: https://i.ytimg.com/vi/YvbgprhDDMM/maxresdefault.jpg

// TODO: Dash
// src: http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd

// TODO: Live Stream (Dash)
// src: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd'
