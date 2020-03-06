import { CenterView } from '@vime/core';
import {
  Player,
  Html5Provider,
  YouTubeProvider,
  DailymotionProvider,
  VimeoProvider,
  Boot
} from '../src'

export default { title: 'Player (Desktop)' };

const THEME = '#f76d82';
const PROVIDERS = [Html5Provider, YouTubeProvider, DailymotionProvider, VimeoProvider];

export const Html5Audio = () => ({
  Component: CenterView,
  props: {
    Component: Player,
    src: '/media/audio/the-battle.mp3',
    theme: THEME,
    providers: PROVIDERS,
    plugins: [Boot]
  }
});

export const Html5Video = () => ({
  Component: CenterView,
  props: {
    Component: Player,
    src: [
      { src: '/media/video/1080p.mp4', type: 'video/mp4', quality: 1080 },
      { src: '/media/video/720p.mp4', type: 'video/mp4', quality: 720 },
      { src: '/media/video/480p.mp4', type: 'video/mp4', quality: 480 },
      { src: '/media/video/360p.mp4', type: 'video/mp4', quality: 360 },
      { src: '/media/video/240p.mp4', type: 'video/mp4', quality: 240 },
      { src: '/media/video/144p.mp4', type: 'video/mp4', quality: 144 }
    ],
    poster: {
      src: '/media/video/poster.png',
      size: 'cover'
    },
    theme: THEME,
    providers: PROVIDERS,
    plugins: [Boot],
    textTracks: [
      {
        default: true,
        kind: 'subtitles',
        label: 'English',
        srclang: 'en',
        src: '/media/video/tracks/en.vtt'
      },
      {
        kind: 'subtitles',
        label: 'Spanish',
        srclang: 'es',
        src: '/media/video/tracks/es.vtt'
      },
      {
        kind: 'subtitles',
        label: 'French',
        srclang: 'fr',
        src: '/media/video/tracks/fr.vtt'
      }
    ]
  }
});

export const Youtube = () => ({
  Component: CenterView,
  props: {
    ...Html5Video().props,
    src: 'youtube/R6MlUcmOul8'
  }
});

export const Dailymotion = () => ({
  Component: CenterView,
  props: {
    ...Html5Video().props,
    src: 'dailymotion/x3a9qe6'
  }
});

export const Vimeo = () => ({
  Component: CenterView,
  props: {
    ...Html5Video().props,
    src: 'vimeo/154225711'
  }
});

// TODO: HLS
// src: http://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
// poster: https://i.ytimg.com/vi/YvbgprhDDMM/maxresdefault.jpg

// TODO: Dash
// src: http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd

// TODO: Live Stream (Dash)
// src: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd'
