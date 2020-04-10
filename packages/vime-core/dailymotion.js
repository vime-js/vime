import { is_string, decode_query_string } from '@vime-js/utils';

export const NAME = 'Dailymotion';
export const ORIGIN = 'https://www.dailymotion.com';
export const API_ENDPOINT = 'https://api.dailymotion.com';
export const SRC = /(?:dai\.ly|dailymotion|dailymotion\.com)\/(?:video\/|embed\/|)(?:video\/|)((?:\w)+)/;

export const PRECONNECTIONS = [
  ORIGIN,
  'https://static1.dmcdn.net',
];

export const DECODER = decode_query_string;

export const can_play = (src) => is_string(src) && SRC.test(src);

export const fetch_video_info_json = (mediaId, fields) => window
  .fetch(`${API_ENDPOINT}/video/${mediaId}?fields=${fields}`)
  .then((response) => response.json());

export const extract_media_id = (src) => {
  const match = src ? src.match(SRC) : null;
  return match ? match[1] : null;
};

export const fetch_video_duration = (src) => {
  const mediaId = extract_media_id(src);
  if (!mediaId) return Promise.resolve(null);
  return fetch_video_info_json(mediaId, 'duration').then((data) => data.duration);
};

export const build_embed_url = (src) => {
  const mediaId = extract_media_id(src);
  return mediaId ? `${ORIGIN}/embed/video/${mediaId}?api=1` : null;
};

export const build_watch_url = (src) => {
  const mediaId = extract_media_id(src);
  return mediaId ? `${ORIGIN}/video/${mediaId}` : null;
};

export const fetch_poster = (src) => {
  const mediaId = extract_media_id(src);
  if (!mediaId) return Promise.resolve(null);
  return fetch_video_info_json(mediaId, 'thumbnail_1080_url').then((data) => data.thumbnail_1080_url);
};
