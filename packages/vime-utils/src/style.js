import { raf } from 'svelte/internal';

// eslint-disable-next-line no-param-reassign
export const set_style = (el, prop, value = null) => { if (el) el.style[prop] = value; };

export const set_style_raf = (el, prop, value) => { raf(() => { set_style(el, prop, value); }); };

export const get_computed_style = (el) => (el ? window.getComputedStyle(el) : null);

export const get_computed_height = (el) => (el ? parseFloat(get_computed_style(el).height) : 0);

export const get_y_padding = (el) => {
  const styles = get_computed_style(el);
  return parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
};

export const get_computed_height_without_padding = (
  el,
) => (el ? (el.clientHeight - get_y_padding(el)) : 0);

export const set_style_background_img = (el, src, size) => {
  set_style(el, 'backgroundImage', src ? `url('${src}')` : null);
  set_style(el, 'backgroundSize', src ? (size || 'contain') : null);
  set_style(el, 'backgroundPosition', src ? '50% 50%' : null);
  set_style(el, 'backgroundRepeat', src ? 'no-repeat' : null);
};
