import React from 'react';
import { Player, Hls, DefaultUi } from '@vime/react';

const IntroPlayer = () => (
  <Player>
    <Hls crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <source
        data-src="https://media.vimejs.com/hls/index.m3u8"
        type="application/x-mpegURL"
      />
    </Hls>

    <DefaultUi />
  </Player>
);

export default IntroPlayer;
