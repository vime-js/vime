import { isString, isInstanceOf } from './unit';

export const AUDIO_EXT = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx)($|\?)/i;
export const VIDEO_EXT = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;
export const HLS_EXT = /\.(m3u8)($|\?)/i;
export const DASH_EXT = /\.(mpd)($|\?)/i;

export const isMediaStream = (src: any) => isInstanceOf(src, MediaStream);
export const isHls = (src: string) => isString(src) && HLS_EXT.test(src);
export const isDash = (src: string) => isString(src) && DASH_EXT.test(src);
export const isAudio = (src: string) => AUDIO_EXT.test(src);
export const isVideo = (src: string) => VIDEO_EXT.test(src);
