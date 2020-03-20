import { Preview } from '@vime-js/preview';
import { InteractiveView } from '../../../views';
import config from '../../../config';

export default { 
  title: 'Packages/Preview/Components',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true }
    }
  }
};

export const Html5 = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    poster: config.File.POSTER,
    events: config.Events.PREVIEW
  }
});

export const Youtube = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: config.YouTube.src,
    events: config.Events.PREVIEW
  }
});

export const Dailymotion = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: config.Dailymotion.src,
    events: config.Events.PREVIEW
  }
});

export const Vimeo = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: config.Vimeo.SRC,
    events: config.Events.PREVIEW
  }
});