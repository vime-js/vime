import { CenterView } from '../../../views';
import Media from '../../../Media';
import { YouTubeLite, YouTube } from '@vime/youtube';

export default { title: 'Packages/Youtube/Components' };

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: YouTubeLite,
    srcId: Media.YouTube.SRC_ID
  }
});

export const Standard = () => ({
  Component: CenterView,
  props: {
    Component: YouTube,
    srcId: Media.YouTube.SRC_ID
  }
});
