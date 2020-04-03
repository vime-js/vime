import { InteractiveView } from '../views';
import { Html5 } from '@vime-js/html5';
import config from '../config';

export default {
  title: 'Packages/Html 5',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true },
    },
  },
};

export const Audio = () => ({
  Component: InteractiveView,
  props: {
    Component: Html5,
    src: config.File.AUDIO,
  },
});

export const Video = () => ({
  Component: InteractiveView,
  props: {
    Component: Html5,
    src: config.File.VIDEO,
    poster: config.File.POSTER,
    tracks: config.File.TRACKS,
  },
});
