import { InteractiveView } from '../../../views';
import { Vimeo, VimeoLite } from '@vime-js/vimeo';
import config from '../../../config';

export default {
  title: 'Packages/Vimeo/Components',
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
    Component: VimeoLite,
    srcId: config.Vimeo.SRC_ID,
    events: config.Events.LITE,
  },
});

export const Standard = () => ({
  Component: InteractiveView,
  props: {
    Component: Vimeo,
    src: config.Vimeo.SRC,
  },
});
