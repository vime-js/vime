import React from 'react';
import './App.css';
import { VimePlayer, VimeYoutube, VimeDefaultUi } from '@vime/react';
import '@vime/react/dist/vime.css'

function App() {
  const onPlaying = (event: CustomEvent<boolean>) => {
    console.log('playing:', event.detail);
  };

  return (
    <div className="container">
      <VimePlayer playsinline onVPlayingChange={onPlaying}>
        <VimeYoutube videoId="DyTCOwB0DVw" />
        <VimeDefaultUi />
      </VimePlayer>
    </div>
  );
}

export default App;
