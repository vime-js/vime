import React, { useRef } from "react";
import { usePlayerContext } from "@vime/react";
import './TapSidesToSeek.css';

function TapSidesToSeek() {
  const ref = useRef(null);

  const [currentTime, setCurrentTime] = usePlayerContext(ref, 'currentTime', 0);
  const [duration] = usePlayerContext(ref, 'duration', -1);

  const onSeekBackward = () => {
    if (currentTime < 5) return;
    setCurrentTime(currentTime - 5);
  };

  const onSeekForward = () => {
    if (currentTime > (duration - 5)) return;
    setCurrentTime(currentTime + 5);
  };

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