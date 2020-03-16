import { CenterView } from '../../../views';
import Media from '../../../Media';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Preview } from '@vime/preview';

export default { 
  title: 'Packages/Preview/Components',
  decorators: [withA11y, withKnobs],
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true }
    }
  }
};

const createKnobs = (src, poster) => ({
  src: text('src', src),
  poster: text('poster' , poster),
  aspectRatio: text('aspectRatio', '16:9'),
  showPlayButton: boolean('showPlayButton', false),
  isEnabled: boolean('isEnabled', true)
});

export const Html5 = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    ...createKnobs(undefined, '/media/video/poster.png')
  }
});

export const Youtube = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    ...createKnobs('youtube/R6MlUcmOul8')
  }
});

export const Dailymotion = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    ...createKnobs('dailymotion/x3a9qe6')
  }
});

export const Vimeo = () => ({
  Component: CenterView,
  props: {
    Component: Preview,
    ...createKnobs('vimeo/154225711')
  }
});