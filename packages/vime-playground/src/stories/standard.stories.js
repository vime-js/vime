import { InteractiveView } from '../views';
import { Html5 as Html5Player } from '@vime-js/html5';
import { YouTube as YouTubePlayer } from '@vime-js/youtube';
import { Vimeo as VimeoPlayer } from '@vime-js/vimeo';
import { Dailymotion as DailymotionPlayer } from '@vime-js/dailymotion';
import config from '../config';

export default {
  title: 'Standard',
};

const base = (props) => ({
  Component: InteractiveView,
  props,
});

export const AudioFile = () => base({
  Component: Html5Player,
  src: config.File.AUDIO,
});

export const VideoFile = () => base({
  Component: Html5Player,
  src: config.File.VIDEO,
  poster: config.File.POSTER,
  tracks: config.File.TRACKS,
});

export const Youtube = () => base({
  Component: YouTubePlayer,
  src: config.YouTube.SRC,
});

export const Vimeo = () => base({
  Component: VimeoPlayer,
  src: config.Vimeo.SRC,
});

export const Dailymotion = () => base({
  Component: DailymotionPlayer,
  src: config.Dailymotion.SRC,
});

