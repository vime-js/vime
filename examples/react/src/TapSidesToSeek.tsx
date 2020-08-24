import React, { useRef } from "react";
import { usePlayerContext, PlayerProp, usePlayerDispatcher } from "@vime/react";
import './TapSidesToSeek.css';

/**
 * The following are "advanced" concepts that you'd only need if you want to create custom 
 * components inside the player.  
 * */
function TapSidesToSeek() {
  /**
   * We need a reference to a DOM element so the Vime hooks work as they rely on dispatching 
   * custom DOM events.
   */
  const ref = useRef(null);

  /**
   * Here we are creating a dispatcher to send updates to the player.
   */
  const dispatch = usePlayerDispatcher(ref);
  
  /**
   * Here we are requesting to receive updates from the player, as the property changes it will be 
   * updated here.
   */
  const currentTime = usePlayerContext(ref, PlayerProp.currentTime, 0);

  const onSeekBackward = () => {
    if (currentTime < 5) return;
    // We are dispatching an update to the player to change the `currentTime` property.
    dispatch(PlayerProp.currentTime, currentTime - 5)
  };

  const onSeekForward = () => {
    dispatch(PlayerProp.currentTime, currentTime + 5)
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