import { is_string, load_image } from '@vime-js/utils';

export const ORIGIN = 'https://www.youtube.com';
export const ORIGIN_NO_COOKIES = 'https://www.youtube-nocookie.com';
export const SRC = /(?:youtu\.be|youtube|youtube\.com|youtube-nocookie\.com)\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|)((?:\w|-){11})/;

export const can_play = src => is_string(src) && SRC.test(src);

export const get_src_id = src => {
  const match = src ? src.match(SRC) : null;
  return match ? match[1] : src;
};

export const build_embed_url = src => {
  const srcId = get_src_id(src);
  return srcId ? `${ORIGIN}/embed/${srcId}` : null;
};

export const build_watch_url = src => {
  const srcId = get_src_id(src);
  return srcId ? `${ORIGIN}/watch?v=${srcId}` : null;
};

export const get_poster = src => {
  const srcId = get_src_id(src);
  if (!srcId) return Promise.resolve(null);
  const posterSrc = quality => `https://i.ytimg.com/vi/${srcId}/${quality}.jpg`;
  // We are testing a that the image has a min-width of 121px because if the thumbnail does
  // not exist YouTube returns a blank/error image that is 120px wide.
  return load_image(posterSrc('maxresdefault'), 121) // 1080p (no padding)
    .catch(() => load_image(posterSrc('sddefault'), 121)) // 640p (padded 4:3)
    .catch(() => load_image(posterSrc('hqdefault'), 121)) // 480p (padded 4:3)
    .then(img => img.src || null);
};
