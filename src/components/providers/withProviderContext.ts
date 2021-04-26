import { PlayerProp } from '../core/player/PlayerProps';
import { withPlayerContext } from '../core/player/withPlayerContext';
import { MediaProvider } from './MediaProvider';

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
