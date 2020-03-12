import { CenterView } from '../../../views';
import Media from '../../../Media';
import { VimeoLite, Vimeo } from '@vime/vimeo';

export default { title: 'Packages/Vimeo/Components' };

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: VimeoLite,
    srcId: Media.Vimeo.SRC_ID
  }
});

export const Standard = () => ({
  Component: CenterView,
  props: {
    Component: Vimeo,
    src: Media.Vimeo.SRC
  }
});
