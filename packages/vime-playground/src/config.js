export default {
  File: {
    AUDIO: '/media/audio/the-battle.mp3',
    VIDEO: [
      { src: '/media/video/1080p.mp4', type: 'video/mp4', quality: 1080 },
      { src: '/media/video/720p.mp4', type: 'video/mp4', quality: 720 },
      { src: '/media/video/480p.mp4', type: 'video/mp4', quality: 480 },
      { src: '/media/video/360p.mp4', type: 'video/mp4', quality: 360 },
      { src: '/media/video/240p.mp4', type: 'video/mp4', quality: 240 },
      { src: '/media/video/144p.mp4', type: 'video/mp4', quality: 144 },
    ],
    POSTER: '/media/video/poster.png',
    TRACKS: [{
      default: true,
      kind: 'subtitles',
      label: 'English',
      srclang: 'en',
      src: '/media/video/tracks/en.vtt',
    },
    {
      kind: 'subtitles',
      label: 'Spanish',
      srclang: 'es',
      src: '/media/video/tracks/es.vtt',
    },
    {
      kind: 'subtitles',
      label: 'French',
      srclang: 'fr',
      src: '/media/video/tracks/fr.vtt',
    }],
  },
  Hls: {
    SRC: 'http://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    POSTER: 'https://i.ytimg.com/vi/YvbgprhDDMM/maxresdefault.jpg',
  },
  Dash: {
    SRC: 'http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd',
    LIVE_SRC: 'http://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd',
  },
  Dailymotion: {
    SRC: 'dailymotion/x3a9qe6',
  },
  YouTube: {
    SRC: 'youtube/R6MlUcmOul8',
  },
  Vimeo: {
    SRC: 'vimeo/154225711',
  },
  Events: {
    PREVIEW: [
      'loading',
      'posterchange',
    ],
    LITE: [
      'load',
      'data',
      'rebuild',
      'ready',
      'titlechange',
      'originchange',
      'embedurlchange',
      'error',
    ],
    COMPLETE: [
      'mount',
      'destroy',
      'pluginmount',
      'plugindestroy',
      'error',
    ],
  },
};
