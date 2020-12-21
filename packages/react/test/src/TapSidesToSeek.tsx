/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';
import { usePlayerContext } from '../../src';
import './TapSidesToSeek.css';

function TapSidesToSeek() {
  /**
   * We need a reference to a DOM element so the Vime hooks work as they rely on dispatching
   * custom DOM events.
   */
  const ref = useRef(null);

  // Little utility hook to get the current player, incase you need to call a method.
  // *** -> const player = usePlayer(ref);

  const [currentTime, setCurrentTime] = usePlayerContext(ref, 'currentTime', 0);
  const [duration] = usePlayerContext(ref, 'duration', -1);
  const [isVideoView] = usePlayerContext(ref, 'isVideoView', false);
  const [isPlaybackReady] = usePlayerContext(ref, 'playbackReady', false);

  const onSeekBackward = () => {
    if (currentTime < 5) return;
    // We are dispatching an update to the player to change the `currentTime` property.
    setCurrentTime(currentTime - 5);
  };

  const onSeekForward = () => {
    if (currentTime > (duration - 5)) return;
    setCurrentTime(currentTime + 5);
  };

  if (!isVideoView || !isPlaybackReady) return null;

  return (
    <div
      ref={ref}
      className="tapSidesToSeek"
    >
      <div
        className="tapTarget"
        onClick={onSeekBackward}
      />

      <div style={{ flex: 1 }} />

      <div
        className="tapTarget"
        onClick={onSeekForward}
      />
    </div>
  );
}

export default TapSidesToSeek;
