export default function aspectRatio (node, aspectRatio) {
  const update = aspectRatio => {
    if (!aspectRatio) {
      node.style.paddingBottom = null;
      node.style.background = null;
      return;
    }
    const [width, height] = aspectRatio.split(':');
    node.style.paddingBottom = `${(100 / width) * height}%`;
    node.style.background = '#000';
  };

  update(aspectRatio);
  node.style.position = 'relative';

  return {
    update,
    destroy () {
      update(null);
      node.style.position = null;
    }
  };
}
