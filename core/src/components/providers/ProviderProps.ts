import {
  isWritableProp,
  PlayerProp,
  PlayerProps,
  WritableProps,
} from '../core/player/PlayerProps';

/**
 * Properties that can only be written to by a provider.
 */
export type ProviderWritableProps = WritableProps &
Pick<
PlayerProps,
| 'ready'
| 'playing'
| 'playbackReady'
| 'playbackStarted'
| 'playbackEnded'
| 'seeking'
| 'buffered'
| 'buffering'
| 'duration'
| 'viewType'
| 'mediaTitle'
| 'mediaType'
| 'currentSrc'
| 'currentPoster'
| 'playbackRates'
| 'playbackQualities'
| 'textTracks'
| 'currentTextTrack'
| 'isTextTrackVisible'
| 'audioTracks'
| 'currentAudioTrack'
| 'isPiPActive'
| 'isFullscreenActive'
>;

const providerWritableProps = new Set<PlayerProp>([
  'ready',
  'playing',
  'playbackReady',
  'playbackStarted',
  'playbackEnded',
  'seeking',
  'buffered',
  'buffering',
  'duration',
  'viewType',
  'mediaTitle',
  'mediaType',
  'currentSrc',
  'currentPoster',
  'playbackRates',
  'playbackQualities',
  'textTracks',
  'currentTextTrack',
  'isTextTrackVisible',
  'audioTracks',
  'currentAudioTrack',
  'isPiPActive',
  'isFullscreenActive',
]);

export const isProviderWritableProp = (prop: PlayerProp) =>
  isWritableProp(prop) || providerWritableProps.has(prop);
