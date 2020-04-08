import {
  NAME, ORIGIN, DECODER,
  PRECONNECTIONS, can_play, build_embed_url,
  extract_src_id,
} from '@vime-js/core/dailymotion';

export default {
  name: NAME,
  decoder: DECODER,
  preconnections: PRECONNECTIONS,
  canPlay: can_play,
  extractSrcId: extract_src_id,
  buildEmbedURL: build_embed_url,
  onLoad: () => {},
  buildOrigin: () => ORIGIN,
  buildPostMessage: (command, args) => ({
    command,
    parameters: args || [],
  }),
  resolveReadyState: (data, ready) => {
    const { event } = data;
    if (event === 'playback_ready') ready.resolve();
    if (event === 'error') ready.reject(data);
  },
  extractMediaTitle: (data) => {
    const { event } = data;
    if (event === 'videochange') return data.title;
    return null;
  },
};
