/* eslint-disable */

import React, { useEffect, useRef } from 'react';
import './App.css';
import {
  Player,
  Video,
  Youtube,
  Vimeo,
  Dailymotion,
  Audio,
  Hls,
  Dash,
  DefaultUi,
  usePlayerContext,
} from '../../src';

// Default theme.
import '@vime/core/themes/default.css';

// Optional light theme (extends default).
// import '@vime/core/themes/light.css';

// Custom UI component.
import TapSidesToSeek from './TapSidesToSeek';

function App() {
  // Obtain a ref if you need to call any methods.
  const player = useRef<HTMLVmPlayerElement>(null);

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
      <Player
        playsinline={true}
        ref={player}
        onVmPlaybackReady={onPlaybackReady}
      >
        {/* YOUTUBE */}
        {/* <Youtube videoId="DyTCOwB0DVw" /> */}

        {/* VIMEO */}
        {/* <Vimeo videoId="411652396" /> */}

        {/* DAILYMOTION */}
        {/* <Dailymotion videoId="k3b11PemcuTrmWvYe0q" /> */}

        {/* VIDEO */}
        {/* <Video crossOrigin="anonymous" poster="https://media.vimejs.com/poster.png">
          <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
          <track default kind="subtitles" src="https://media.vimejs.com/subs/english.vtt" srcLang="en" label="English" />
          <track kind="subtitles" src="https://media.vimejs.com/subs/spanish.vtt" srcLang="es" label="Spanish" />
        </Video> */}

        {/* AUDIO */}
        {/* <Audio crossOrigin="anonymous">
          <source data-src="https://media.vimejs.com/audio.mp3" type="audio/mp3" />
        </Audio> */}

        {/* HLS */}
        {/* <Hls crossOrigin="anonymous" poster="https://media.vimejs.com/poster.png">
          <source data-src="https://media.vimejs.com/hls/index.m3u8" type="application/x-mpegURL" />
        </Hls> */}

        {/* DASH */}
        {/* <Dash
          cross-origin="anonymous"
          src="https://media.vimejs.com/mpd/manifest.mpd"
          poster="https://media.vimejs.com/poster.png"
        /> */}

        <DefaultUi>
          {/* Custom UI Component. */}
          <TapSidesToSeek />
        </DefaultUi>
      </Player>
    </div>
  );
}

export default App;
