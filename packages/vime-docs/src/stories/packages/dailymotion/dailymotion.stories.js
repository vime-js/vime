import { CenterView } from '../../../views';
import { Dailymotion, DailymotionLite } from '@vime-js/dailymotion';
import config from '../../../config';

export default { title: 'Packages/Dailymotion/Components' };

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: DailymotionLite,
    srcId: config.Dailymotion.SRC_ID,
    events: config.Events.LITE,
  },
});

export const Standard = () => ({
  Component: CenterView,
  props: {
    Component: Dailymotion,
    srcId: config.Dailymotion.SRC,
  },
});
