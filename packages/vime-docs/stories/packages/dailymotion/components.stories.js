import { CenterView } from '../../../views';
import Media from '../../../Media';
import { Dailymotion, DailymotionLite } from '@vime/dailymotion';

export default { title: 'Packages/Dailymotion/Components' };

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: DailymotionLite,
    srcId: Media.Dailymotion.SRC_ID
  }
});

export const Standard = () => ({
  Component: CenterView,
  props: {
    Component: Dailymotion,
    srcId: Media.Dailymotion.SRC_ID
  }
});