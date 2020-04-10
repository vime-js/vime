import {
  NAME, EMBED_ORIGIN as ORIGIN, DECODER,
  PRECONNECTIONS, can_play, build_embed_url,
  extract_media_id,
} from '@vime-js/core/vimeo';

export default {
  name: NAME,
  decoder: DECODER,
  preconnections: PRECONNECTIONS,
  canPlay: can_play,
  buildEmbedURL: build_embed_url,
  extractMediaId: extract_media_id,
  onLoad: () => {},
  buildOrigin: () => ORIGIN,
  buildPostMessage: (command, args) => ({
    method: command,
    value: args || '',
  }),
  resolveReadyState: (data, ready, sendCommand) => {
    const { event, data: payload } = data;
    if ((event === 'error') && payload && payload.method === 'ready') {
      const error = new Error(payload.message);
      error.name = payload.name;
      ready.reject(error);
    }
    if (event === 'ready') sendCommand('addEventListener', 'loaded', true);
    if (event === 'loaded') {
      ready.resolve();
      sendCommand('getVideoTitle', [], true);
    }
  },
  extractMediaTitle: (data) => {
    if (data.method === 'getVideoTitle') return data.value;
    return null;
  },
};
