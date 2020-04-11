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

export const AudioFile = () => base({ src: config.File.AUDIO });

export const VideoFile = () => base({
  src: config.File.VIDEO,
  poster: config.File.POSTER,
  tracks: config.File.TRACKS,
});

export const Youtube = () => base({ src: config.YouTube.SRC });
export const Vimeo = () => base({ src: config.Vimeo.SRC });
export const Dailymotion = () => base({ src: config.Dailymotion.SRC });
export const HLS = () => base({ src: config.Hls.SRC });
export const Dash = () => base({ src: config.Dash.SRC });
export const DashLive = () => base({ src: config.Dash.LIVE_SRC });
