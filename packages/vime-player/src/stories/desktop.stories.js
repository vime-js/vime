import {
  Html5 as Html5Provider,
  YouTube as YouTubeProvider,
  Dailymotion as DailymotionProvider,
  Vimeo as VimeoProvider,
  Hls as HlsProvider,
  Dash as DashProvider,
  Boot
} from '~src/main';

import PlayerView from './views/PlayerView.svelte';

export default { title: 'Desktop' };

const theme = '#f76d82';

export const Audio = () => ({
  Component: PlayerView,
  props: {
    src: '/media/audio/the-battle.mp3',
    plugins: [Html5Provider, Boot]
  }
});

export const AudioWithPoster = () => ({
  Component: PlayerView,
  props: {
    src: '/media/audio/the-battle.mp3',
    plugins: [Html5Provider, Boot],
    poster: '/media/video/poster.png'
  }
});

export const ThemedAudio = () => ({
  Component: PlayerView,
  props: {
    ...Audio().props,
    theme
  }
});

export const Video = () => ({
  Component: PlayerView,
  props: {
    src: [
      { src: '/media/video/1080p.mp4', type: 'video/mp4', quality: '1080p' },
      { src: '/media/video/720p.mp4', type: 'video/mp4', quality: '720p' },
      { src: '/media/video/480p.mp4', type: 'video/mp4', quality: '480p' },
      { src: '/media/video/360p.mp4', type: 'video/mp4', quality: '360p' },
      { src: '/media/video/240p.mp4', type: 'video/mp4', quality: '240p' },
      { src: '/media/video/144p.mp4', type: 'video/mp4', quality: '144p' }
    ],
    poster: '/media/video/poster.png',
    // poster: {
    //   src: '/media/video/poster.png',
    //   size: 'cover'
    // },
    plugins: [Html5Provider, Boot],
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

export const ThemedVideo = () => ({
  Component: PlayerView,
  props: {
    ...Video().props,
    theme
  }
});

export const Youtube = () => ({
  Component: PlayerView,
  props: {
    ...Video().props,
    src: 'https://www.youtube.com/watch?v=R6MlUcmOul8',
    plugins: [YouTubeProvider, Boot]
  }
});

export const Dailymotion = () => ({
  Component: PlayerView,
  props: {
    ...Video().props,
    src: 'https://www.dailymotion.com/video/x3a9qe6',
    plugins: [DailymotionProvider, Boot]
  }
});

export const Vimeo = () => ({
  Component: PlayerView,
  props: {
    ...Video().props,
    src: 'https://vimeo.com/154225711',
    plugins: [VimeoProvider, Boot]
  }
});

export const Hls = () => ({
  Component: PlayerView,
  props: {
    src: 'http://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    poster: 'https://i.ytimg.com/vi/YvbgprhDDMM/maxresdefault.jpg',
    plugins: [HlsProvider, Boot]
  }
});

export const Dash = () => ({
  Component: PlayerView,
  props: {
    src: 'http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd',
    plugins: [DashProvider, Boot]
  }
});

export const Live = () => ({
  Component: PlayerView,
  props: {
    src: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd',
    plugins: [DashProvider, Boot]
  }
});
