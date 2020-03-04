import { CenterView } from '@vime/core';
import { YouTubeLite, YouTube } from '../src';

export default { title: 'YouTube' };

const srcId = 'R6MlUcmOul8';

export const Lite = () => ({
  Component: CenterView,
  props: {
    Component: YouTubeLite,
    srcId
  }
});

export const Full = () => ({
  Component: CenterView,
  props: {
    Component: YouTube,
    src: srcId
  }
});
