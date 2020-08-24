import React, { useRef } from 'react';
import './App.css';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/react';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI component.
import TapSidesToSeek from './TapSidesToSeek';

function App() {
  const player = useRef<HTMLVimePlayerElement>(null);

  const onPlaybackReady = () => {
    // ...
  };

  return (
    <div id="container">
      <VimePlayer 
        playsinline 
        ref={player}
        onVPlaybackReady={onPlaybackReady}
      >
        <VimeVideo poster="http://localhost:3335/poster.png">
          <source data-src="http://localhost:3335/720p.mp4" type="video/mp4" />
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
