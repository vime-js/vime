import { Preview } from '@vime/preview';
import { InteractiveView } from '../../../views';
import Media from '../../../Media';

export default { 
  title: 'Packages/Preview/Components',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true }
    }
  }
};

const propTypes = {
  src: 'text',
  isEnabled: 'boolean',
  poster: 'text',
  aspectRatio: 'text',
  showPlayButton: 'boolean'
};

const events = ['loading', 'posterchange'];

export const Html5 = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    poster: '/media/video/poster.png',
    propTypes,
    events
  }
});

export const Youtube = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: 'youtube/R6MlUcmOul8',
    propTypes,
    events
  }
});

export const Dailymotion = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: 'dailymotion/x3a9qe6',
    propTypes,
    events
  }
});

export const Vimeo = () => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    src: 'vimeo/154225711',
    propTypes,
    events
  }
});