import React from 'react';
import { Player, Hls, DefaultUi } from '@vime/react';

const IntroPlayer = () => (
  <Player>
    <Hls crossOrigin="" poster="https://files.vidstack.io/agent-327/poster.png">
      <source
        data-src="https://files.vidstack.io/agent-327/hls/stream.m3u8"
        type="application/x-mpegURL"
      />
    </Hls>

    <DefaultUi />
  </Player>
);

export default IntroPlayer;
