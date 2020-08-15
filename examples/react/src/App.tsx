import React, { useState } from 'react';
import './App.css';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/react';
import '@vime/react/dist/vime.css'

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(true);

  const onTimeUpdate = (event: CustomEvent<number>) => {
    setCurrentTime(event.detail);
  }

  const onMutedChange = (event: CustomEvent<boolean>) => {
    setMuted(event.detail);
  }

  const onSeekBackward = () => {
    setCurrentTime(currentTime - 5);
  }

  const onSeekForward = () => {
    setCurrentTime(currentTime + 5);
  }

  return (
    <div id="container">
      <VimePlayer 
        playsinline
        muted={muted}
        currentTime={currentTime}
        onVCurrentTimeChange={onTimeUpdate}
        onVMutedChange={onMutedChange}
      >
        <VimeVideo crossOrigin="true" poster="http://localhost:3335/poster.png">
          <source data-src="http://localhost:3335/720p.mp4" type="video/mp4" />
        </VimeVideo>

        <VimeDefaultUi />
      </VimePlayer>

      <div id="buttons">
		    <button onClick={onSeekBackward}>-5s</button>
    		<button onClick={onSeekForward}>+5s</button>
      </div>
    </div>
  );
}

export default App;
