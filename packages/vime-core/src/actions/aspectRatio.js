import { set_style } from '@vime/utils';

export default function aspectRatio (node, aspectRatio) {
  const update = aspectRatio => {
    if (!aspectRatio) {
      set_style(node, 'paddingBottom');
      return;
    }
    const [width, height] = aspectRatio.split(':');
    set_style(node, 'paddingBottom', `${(100 / width) * height}%`);
  };

  update(aspectRatio);

  return {
    update,
    destroy () {
      update(null);
    }
  };
}
