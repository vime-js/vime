import { InteractiveView } from '../views';
import config from '../config';

import {
  Player, Html5Provider, YouTubeProvider,
  DailymotionProvider, VimeoProvider, Boot,
} from '@vime-js/player';

export default {
  title: 'Complete',
};

const THEME = '#f76d82';
const EVENTS = config.Events.COMPLETE;
const PROVIDERS = [Html5Provider, YouTubeProvider, DailymotionProvider, VimeoProvider];

const videoBase = (props) => ({
  Component: InteractiveView,
  props: {
    Component: Player,
    poster: config.File.POSTER,
    theme: THEME,
    events: EVENTS,
    providers: PROVIDERS,
    plugins: [Boot],
    tracks: config.File.TRACKS,
    ...props,
  },
});

export const AudioFile = () => ({
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

export const VideoFile = () => videoBase({
  src: config.File.VIDEO,
});

export const Youtube = () => videoBase({
  src: config.YouTube.SRC,
});

export const Vimeo = () => videoBase({
  src: config.Vimeo.SRC,
});

export const Dailymotion = () => videoBase({
  src: config.Dailymotion.SRC,
});

// TODO: HLS
// src: http://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
// poster: https://i.ytimg.com/vi/YvbgprhDDMM/maxresdefault.jpg

// TODO: Dash
// src: http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd

// TODO: Live Stream (Dash)
// src: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd'
