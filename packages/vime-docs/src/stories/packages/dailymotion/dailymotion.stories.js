import { InteractiveView } from '../../../views';
import { Dailymotion, DailymotionLite } from '@vime-js/dailymotion';
import config from '../../../config';

export default {
  title: 'Packages/Dailymotion/Components',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
};

export const Lite = () => ({
  Component: InteractiveView,
  props: {
    Component: DailymotionLite,
    srcId: config.Dailymotion.SRC_ID,
    events: config.Events.LITE,
  },
});

export const Standard = () => ({
  Component: InteractiveView,
  props: {
    Component: Dailymotion,
    src: config.Dailymotion.SRC,
  },
});
