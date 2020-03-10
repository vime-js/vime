import { is_string } from '@vime/utils';

export const ORIGIN = 'https://www.vimeo.com';
export const EMBED_ORIGIN = 'https://player.vimeo.com';
export const SRC = /vimeo(?:\.com|)\/([0-9]{9,})/;
export const FILE_URL = /vimeo\.com\/external\/[0-9]+\..+/;
export const THUMBNAIL_URL = /vimeocdn\.com\/video\/([0-9]+)/;

export const can_play = src => is_string(src) && !FILE_URL.test(src) && SRC.test(src);

export const get_src_id = src => {
  const match = src ? src.match(SRC) : null;
  return match ? match[1] : src;
};

export const build_embed_url = src => {
  const srcId = get_src_id(src);
  return srcId ? `${EMBED_ORIGIN}/video/${srcId}` : null;
};

export const build_watch_url = src => {
  const srcId = get_src_id(src);
  return srcId ? `${ORIGIN}/${srcId}` : null;
};

export const get_poster = src => {
  const url = build_embed_url(src);
  if (!url) return Promise.resolve(null);
  return window.fetch(`https://noembed.com/embed?url=${url}`)
    .then(response => response.json())
    .then(data => {
      const thumbnailId = data.thumbnail_url.match(THUMBNAIL_URL)[1];
      return `https://i.vimeocdn.com/video/${thumbnailId}_1920x1080.jpg`;
    });
};