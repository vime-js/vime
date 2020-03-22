import { element } from 'svelte/internal';

export const load_script = (src, onLoad, onError) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  script.onerror = onError;

  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
};

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const load_image = (src, minWidth = 1) => new Promise((resolve, reject) => {
  const image = new Image();
  const handler = () => {
    delete image.onload;
    delete image.onerror;
    image.naturalWidth >= minWidth ? resolve(image) : reject(image);
  };
  Object.assign(image, { onload: handler, onerror: handler, src });
});

export const load_sprite = (src) => fetch(src)
  .then((res) => res.text())
  .then((sprite) => {
    const div = element('div');
    div.style.display = 'none';
    div.innerHTML = sprite;
    const firstLinkTag = document.getElementsByTagName('link')[0];
    firstLinkTag.parentNode.insertBefore(div, firstLinkTag);
    return div;
  });
