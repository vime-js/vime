import { InteractiveView } from '../../../views';
import Media from '../../../Media';
import { Html5 } from '@vime/html5';

export default { 
  title: 'Packages/Html 5/Components',
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true }
    }
  }
};

export const Audio = () => ({
  Component: InteractiveView,
  props: {
    Component: Html5,
    src: Media.File.AUDIO
  }
});

export const Video = () => ({
  Component: InteractiveView,
  props: {
    Component: Html5,
    src: Media.File.VIDEO,
    poster: Media.File.POSTER,
    tracks: Media.File.TRACKS
  }
});