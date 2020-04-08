import config from '../config';
import { InteractiveView } from '../views';

import {
  Player, YouTubeProvider, VimeoProvider,
  DailymotionProvider,
} from '@vime-js/lite';

export default {
  title: 'Lite',
};

const base = (src) => ({
  Component: InteractiveView,
  props: {
    Component: Player,
    src,
    providers: [YouTubeProvider, VimeoProvider, DailymotionProvider],
    events: config.Events.LITE,
  },
});

export const Youtube = () => base(config.YouTube.SRC);
export const Vimeo = () => base(config.Vimeo.SRC);
export const Dailymotion = () => base(config.Dailymotion.SRC);
