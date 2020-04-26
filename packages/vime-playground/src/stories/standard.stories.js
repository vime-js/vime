import { InteractiveView } from '../views';
import config from '../config';

import {
  Player, FileProvider, YouTubeProvider,
  VimeoProvider, DailymotionProvider, HlsProvider,
  DashProvider,
} from '@vime-js/standard';

export default {
  title: 'Standard',
};

const base = (props) => ({
  Component: InteractiveView,
  props: {
    Component: Player,
    providers: [
      FileProvider, YouTubeProvider, VimeoProvider,
      DailymotionProvider, HlsProvider, DashProvider,
    ],
    ...props,
  },
});

const videoFileBase = (src) => base({
  src,
  poster: config.File.POSTER,
  tracks: config.File.TRACKS,
});

export const AudioFile = () => base({ src: config.File.AUDIO });

export const VideoFile = () => videoFileBase(config.File.VIDEO);
export const Youtube = () => base({ src: config.YouTube.SRC });
export const Vimeo = () => base({ src: config.Vimeo.SRC });
export const Dailymotion = () => base({ src: config.Dailymotion.SRC });
export const HLS = () => videoFileBase(config.Hls.SRC);
export const Dash = () => videoFileBase(config.Dash.SRC);
export const DashLive = () => base({ src: config.Dash.LIVE_SRC, hideCredits: true });
