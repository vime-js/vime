import { PlayerProp } from './PlayerProps';
import { MediaPlayer } from './MediaPlayer';

// Events that toggle state and the prop is named `is{PropName}Active`.
const isToggleStateEvent = new Set([
  PlayerProp.IsFullscreenActive,
  PlayerProp.isPiPActive,
  PlayerProp.IsLive,
  PlayerProp.IsTouch,
]);

// Events that are emitted without the 'Change' postfix.
const hasShortenedEventName = new Set([
  PlayerProp.PlaybackStarted,
  PlayerProp.PlaybackEnded,
  PlayerProp.PlaybackReady,
  PlayerProp.LoadedMetadata,
]);

let startedSeeking = false;

export const firePlayerEvent = (player: MediaPlayer, prop: PlayerProp, value: any) => {
  let eventName;

  if (isToggleStateEvent.has(prop)) {
    // Example: isFullscreenActive -> vFullscreenChange
    eventName = `v${prop.replace('is', '').replace('Active', '')}Change`;
  } else if (hasShortenedEventName.has(prop)) {
    // Example: playbackStarted -> vPlaybackStarted
    eventName = `v${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
  } else {
    // Example: currentTime -> vCurrentTimeChange
    eventName = `v${prop.charAt(0).toUpperCase()}${prop.slice(1)}Change`;
  }

  player[eventName]?.emit(value);

  if ((prop === PlayerProp.Paused) && !value) player.vPlay.emit();

  if (prop === PlayerProp.Seeking) {
    if (startedSeeking && !value) player.vSeeked.emit();
    startedSeeking = value;
  }
};
