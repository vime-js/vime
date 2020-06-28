import { is_string, is_instance_of } from './unit.utils';

export const AUDIO_EXT = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXT = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
export const HLS_EXT = /\.(m3u8)($|\?)/i;
export const DASH_EXT = /\.(mpd)($|\?)/i;

export const is_media_stream = (src: any) => is_instance_of(src, MediaStream);
export const is_hls = (src: string) => is_string(src) && HLS_EXT.test(src);
export const is_dash = (src: string) => is_string(src) && DASH_EXT.test(src);
export const is_audio = (src: string) => AUDIO_EXT.test(src);
export const is_video = (src: string) => VIDEO_EXT.test(src);
