import {
  NAME, DECODER, PRECONNECTIONS,
  can_play, build_embed_url, build_origin,
  extract_media_id,
} from '@vime-js/core/youtube';

export default {
  name: NAME,
  decoder: DECODER,
  preconnections: PRECONNECTIONS,
  canPlay: can_play,
  buildOrigin: build_origin,
  extractMediaId: extract_media_id,
  buildEmbedURL: build_embed_url,
  onLoad: (embed) => {
    // Seems like we have to wait a random small delay or else YT player isn't ready.
    setTimeout(() => embed.postMessage({ event: 'listening' }), 100);
  },
  buildPostMessage: (command, args) => ({
    event: 'command',
    func: command,
    args: args || '',
  }),
  resolveReadyState: (data, ready) => {
    const { info, event } = data;
    const playerState = info && info.playerState;
    if (event === 'error') ready.reject(info);
    if (playerState === 5) ready.resolve();
  },
  extractMediaTitle: (data) => {
    const videoData = data.info && data.info.videoData;
    const title = videoData && videoData.title;
    return title || null;
  },
};
