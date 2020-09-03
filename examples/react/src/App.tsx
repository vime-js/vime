import React, { useEffect, useRef } from 'react';
import './App.css';
import { VimePlayer, VimeVideo, VimeDefaultUi, usePlayerContext } from '@vime/react';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI component.
import TapSidesToSeek from './TapSidesToSeek';

function App() {
	// Obtain a ref if you need to call any methods.
  const player = useRef<HTMLVimePlayerElement>(null);

  const onPlaybackReady = () => {
    // ...
  };

  // If you prefer hooks :)
  const [currentTime] = usePlayerContext(player, 'currentTime', 0);

  useEffect(() => {
    console.log(currentTime);
  }, [currentTime]);

  return (
    <div id="container">
      <VimePlayer 
        playsinline 
        ref={player}
        onVPlaybackReady={onPlaybackReady}
      >
        <VimeVideo poster="https://vimejs.com/media/poster.png">
          <source data-src="https://vimejs.com/media/720p.mp4" type="video/mp4" />
        </VimeVideo>

        <VimeDefaultUi>
          {/* Custom UI Component. */}
          <TapSidesToSeek />
        </VimeDefaultUi>
      </VimePlayer>
    </div>
  );
}

export default App;
