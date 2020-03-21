import { is_string } from '@vime-js/utils';

export const ORIGIN = 'https://www.dailymotion.com';
export const API_ENDPOINT = 'https://api.dailymotion.com';
export const SRC = /(?:dai\.ly|dailymotion|dailymotion\.com)\/(?:video\/|embed\/|)(?:video\/|)((?:\w)+)/;

export const can_play = (src) => is_string(src) && SRC.test(src);

export const fetch_video_info_json = (srcId, fields) => window.fetch(`${API_ENDPOINT}/video/${srcId}?fields=${fields}`)
  .then((response) => response.json());

export const get_duration = (srcId) => {
  if (!srcId) return Promise.resolve(null);
  return fetch_video_info_json(srcId, 'duration').then((data) => data.duration);
};

export const get_src_id = (src) => {
  const match = src ? src.match(SRC) : null;
  return match ? match[1] : src;
};

export const build_embed_url = (src) => {
  const srcId = get_src_id(src);
  return srcId ? `${ORIGIN}/embed/video/${srcId}` : null;
};

export const build_watch_url = (src) => {
  const srcId = get_src_id(src);
  return srcId ? `${ORIGIN}/video/${srcId}` : null;
};

export const get_poster = (src) => {
  const srcId = get_src_id(src);
  if (!srcId) return Promise.resolve(null);
  return fetch_video_info_json(srcId, 'thumbnail_1080_url').then((data) => data.thumbnail_1080_url);
};
