import { set_style } from '@vime-js/utils';

export default function aspectRatio(node, initialAspectRatio) {
  const update = (newAspectRatio) => {
    if (!newAspectRatio) {
      set_style(node, 'paddingBottom');
      return;
    }
    const [width, height] = newAspectRatio.split(':');
    set_style(node, 'paddingBottom', `${(100 / width) * height}%`);
  };

  update(initialAspectRatio);

  return {
    update,
    destroy() {
      update(null);
    },
  };
}
