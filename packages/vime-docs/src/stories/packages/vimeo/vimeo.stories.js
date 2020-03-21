import { CenterView } from '../../../views';
import { VimeoLite, Vimeo } from '@vime-js/vimeo';
import config from '../../../config';

export default { title: 'Packages/Vimeo/Components' };

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: VimeoLite,
    srcId: config.Vimeo.SRC_ID,
    events: config.Events.LITE,
  },
});

export const Standard = () => ({
  Component: CenterView,
  props: {
    Component: Vimeo,
    src: config.Vimeo.SRC,
  },
});
