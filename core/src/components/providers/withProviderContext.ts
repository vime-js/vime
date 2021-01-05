import { PlayerProp } from '../core/player/PlayerProps';
import { MediaProvider } from './MediaProvider';
import { withPlayerContext } from '../core/player/withPlayerContext';

export const withProviderContext = (
  provider: MediaProvider,
  additionalProps: PlayerProp[] = [],
) =>
  withPlayerContext(provider, [
    'autoplay',
    'controls',
    'language',
    'muted',
    'logger',
    'loop',
    'aspectRatio',
    'playsinline',
    ...additionalProps,
  ]);
