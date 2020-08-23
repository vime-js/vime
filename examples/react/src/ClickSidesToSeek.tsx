import React, { useRef, Fragment } from "react";
import { usePlayerContext, PlayerProp, usePlayerDispatcher } from "@vime/react";

/**
 * The following are "advanced" concepts that you'd only need if you want to create custom 
 * components inside the player.  
 * */
function ClickSidesToSeek() {
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
   * Here we are binding this property to the player, as the property changes on the player, it 
   * will be updated here.
   */
  const currentTime = usePlayerContext(ref, PlayerProp.CurrentTime, 0);

  const onSeekBackward = () => {
    if (currentTime < 5) return;
    // We are dispatching a state change that will update the player.
    dispatch(PlayerProp.CurrentTime, currentTime - 5)
  };

  const onSeekForward = () => {
    dispatch(PlayerProp.CurrentTime, currentTime + 5)
  };

  const buildStyles = (side: 'left' | 'right') => ({
    position: 'absolute',
    top: 0,
    [side]: 0,
    width: '7.5%',
    height: '100%',
    pointerEvents: 'auto',
    zIndex: 21,
  });

  return (
    <Fragment>
      <div 
        ref={ref} 
        onClick={onSeekBackward}
        style={buildStyles('left') as any}
      />

      <div 
        onClick={onSeekForward}
        style={buildStyles('right') as any}
      />
    </Fragment>
  );
}

export default ClickSidesToSeek;