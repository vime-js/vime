import { CenterView } from '@vime/core';
import { DailymotionLite, Dailymotion } from '../src';

export default { title: 'Dailymotion' };

const srcId = 'x3a9qe6';

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: DailymotionLite,
    srcId
  }
});

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: Dailymotion,
    srcId
  }
});
