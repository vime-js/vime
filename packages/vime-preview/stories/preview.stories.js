import { CenterView } from '@vime/core';
import { Preview } from '../src';

export default { title: 'Preview' };

export const Html5 = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    poster: '/media/video/poster.png'
  }
});

export const Youtube = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    src: 'youtube/R6MlUcmOul8'
  }
});

export const Dailymotion = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    src: 'dailymotion/x3a9qe6'
  }
});

export const Vimeo = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    src: 'vimeo/154225711'
  }
});