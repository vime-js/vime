import { Preview } from '@vime-js/preview';
import { InteractiveView } from '../views';
import config from '../config';

export default {
  title: 'Preview',
};

const base = (props) => ({
  Component: InteractiveView,
  props: {
    Component: Preview,
    events: config.Events.PREVIEW,
    smallView: true,
    ...props,
  },
});

export const File = () => base({ poster: config.File.POSTER });
export const Youtube = () => base({ src: config.YouTube.SRC });
export const Vimeo = () => base({ src: config.Vimeo.SRC });
export const Dailymotion = () => base({ src: config.Dailymotion.SRC });
