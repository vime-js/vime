import { CenterView } from '../../../views';
import Media from '../../../Media';
import { Html5 } from '@vime/html5';

export default { title: 'Packages/Html5/Components' };

export const Audio = () => ({
  Component: CenterView,
  props: {
    Component: Html5,
    src: Media.File.AUDIO
  }
});

export const Video = () => ({
  Component: CenterView,
  props: {
    Component: Html5,
    src: Media.File.VIDEO,
    poster: Media.File.POSTER,
    tracks: Media.File.TRACKS
  }
});