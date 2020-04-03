import { InteractiveView } from '../views';
import { YouTubeLite } from '@vime-js/youtube';
import { VimeoLite } from '@vime-js/vimeo';
import { DailymotionLite } from '@vime-js/dailymotion';
import config from '../config';

export default {
  title: 'Lite',
};

const base = (srcId, Player) => ({
  Component: InteractiveView,
  props: {
    Component: Player,
    srcId,
    events: config.Events.LITE,
  },
});

export const Youtube = () => base(config.YouTube.SRC_ID, YouTubeLite);
export const Vimeo = () => base(config.Vimeo.SRC_ID, VimeoLite);
export const Dailymotion = () => base(config.Dailymotion.SRC_ID, DailymotionLite);
