import { PlayerView } from '../../../views';
import Media from '../../../Media';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { Html5 } from '@vime/html5';
import PlayerKnobs from '../../../knobs/player-knobs';

export default { 
  title: 'Packages/Html 5/Components',
  decorators: [withA11y, withKnobs],
  parameters: {
    viewMode: 'story',
    previewTabs: {
      'storybook/docs/panel': { hidden: true }
    }
  }
};

export const Audio = () => ({
  Component: PlayerView,
  props: {
    Component: Html5,
    ...PlayerKnobs(Media.File.AUDIO)
  }
});

export const Video = () => ({
  Component: PlayerView,
  props: {
    Component: Html5,
    ...PlayerKnobs(Media.File.VIDEO, Media.File.POSTER, Media.File.TRACKS)
  }
});