import React from 'react';
import { Player, Video, DefaultUi, DefaultControls } from '@vime/react';

const DefaultControlsPlayer = () => (
  <Player>
    <Video
      crossOrigin=""
      poster="https://files.vidstack.io/agent-327/poster.png"
    >
      <source
        data-src="https://files.vidstack.io/agent-327/720p.mp4"
        type="video/mp4"
      />
      <track
        default
        kind="subtitles"
        src="https://files.vidstack.io/agent-327/subs/english.vtt"
        srcLang="en"
        label="English"
      />
    </Video>

    <DefaultUi noControls>
      <DefaultControls hideOnMouseLeave activeDuration={2000} />
    </DefaultUi>
  </Player>
);

export default DefaultControlsPlayer;
