import { CenterView } from '@vime/core';
import { Html5 } from '../src';

export default { title: 'Html5' };

const poster = '/media/video/poster.png';
const audioSrc = '/media/audio/the-battle.mp3';
const videoSrc = [
  { src: '/media/video/1080p.mp4', type: 'video/mp4', quality: '1080p' },
  { src: '/media/video/720p.mp4', type: 'video/mp4', quality: '720p' },
  { src: '/media/video/480p.mp4', type: 'video/mp4', quality: '480p' },
  { src: '/media/video/360p.mp4', type: 'video/mp4', quality: '360p' },
  { src: '/media/video/240p.mp4', type: 'video/mp4', quality: '240p' },
  { src: '/media/video/144p.mp4', type: 'video/mp4', quality: '144p' }
];

export const Audio = () => ({
  Component: CenterView,
  props: {
    Component: Html5,
    src: audioSrc
  }
});

export const Video = () => ({
  Component: CenterView,
  props: {
    Component: Html5,
    src: videoSrc,
    poster
  }
});