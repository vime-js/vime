import { InteractiveView } from '../views';
import { YouTube, YouTubeLite } from '@vime-js/youtube';
import config from '../config';

export default {
  title: 'Packages/Youtube',
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
    Component: YouTubeLite,
    srcId: config.YouTube.SRC_ID,
    events: config.Events.LITE,
  },
});

export const Standard = () => ({
  Component: InteractiveView,
  props: {
    Component: YouTube,
    src: config.YouTube.SRC,
  },
});
