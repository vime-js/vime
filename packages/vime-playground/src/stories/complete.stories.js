import { InteractiveView } from '../views';
import config from '../config';

import {
  Player, FileProvider, YouTubeProvider,
  DailymotionProvider, VimeoProvider, HlsProvider,
  Boot,
} from '@vime-js/complete';

export default {
  title: 'Complete',
};

const THEME = '#f76d82';
const EVENTS = config.Events.COMPLETE;

const PROVIDERS = [
  FileProvider, YouTubeProvider, VimeoProvider,
  DailymotionProvider, HlsProvider,
];

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

export const VideoFile = () => videoBase({ src: config.File.VIDEO });
export const Youtube = () => videoBase({ src: config.YouTube.SRC });
export const Vimeo = () => videoBase({ src: config.Vimeo.SRC });
export const Dailymotion = () => videoBase({ src: config.Dailymotion.SRC });

export const HLS = () => videoBase({
  src: config.Hls.SRC,
  poster: config.Hls.POSTER,
  tracks: [],
});
