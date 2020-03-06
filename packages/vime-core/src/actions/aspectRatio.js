export default function aspectRatio (node, aspectRatio) {
  const update = aspectRatio => {
    if (!aspectRatio) {
      node.style.paddingBottom = null;
      node.style.background = null;
      return;
    }
    const [width, height] = aspectRatio.split(':');
    node.style.background = '#000';
    node.style.paddingBottom = `${(100 / width) * height}%`;
  };

  update(aspectRatio);

  return {
    update,
    destroy () {
      update(null);
    }
  };
}
