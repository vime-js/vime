export default {
  File: {
    AUDIO: '/media/audio/40-years-later.mp3',
    VIDEO: [
      { src: '/media/video/1080p.mp4', type: 'video/mp4', quality: 1080 },
      { src: '/media/video/720p.mp4', type: 'video/mp4', quality: 720 },
      { src: '/media/video/480p.mp4', type: 'video/mp4', quality: 480 },
      { src: '/media/video/360p.mp4', type: 'video/mp4', quality: 360 },
      { src: '/media/video/240p.mp4', type: 'video/mp4', quality: 240 },
    ],
    POSTER: '/media/video/poster.png',
    TRACKS: [{
      default: true,
      kind: 'subtitles',
      label: 'English',
      srclang: 'en',
      src: '/media/video/subs/english.vtt',
    },
    {
      kind: 'subtitles',
      label: 'Spanish',
      srclang: 'es',
      src: '/media/video/subs/spanish.vtt',
    },
    {
      kind: 'subtitles',
      label: 'French',
      srclang: 'fr',
      src: '/media/video/subs/french.vtt',
    }, {
      kind: 'subtitles',
      label: 'German',
      srclang: 'ger',
      src: '/media/video/subs/german.vtt',
    }, {
      kind: 'subtitles',
      label: 'Italian',
      srclang: 'ita',
      src: '/media/video/subs/italian.vtt',
    }, {
      kind: 'subtitles',
      label: 'Russian',
      srclang: 'rus',
      src: '/media/video/subs/russian.vtt',
    }],
  },
  Hls: {
    SRC: '/media/video/hls/index.m3u8',
  },
  Dash: {
    SRC: '/media/video/mpd/manifest.mpd',
    LIVE_SRC: 'https://livesim.dashif.org/livesim/testpic_2s/Manifest.mpd',
  },
  Dailymotion: {
    SRC: 'dailymotion/k3b11PemcuTrmWvYe0q',
  },
  YouTube: {
    SRC: 'youtube/DyTCOwB0DVw',
  },
  Vimeo: {
    SRC: 'vimeo/411652396',
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
