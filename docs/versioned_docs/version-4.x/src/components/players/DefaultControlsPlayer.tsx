import React from 'react';
import { Player, Video, DefaultUi, DefaultControls } from '@vime/react';

const DefaultControlsPlayer = () => (
  <Player>
    <Video crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
      <track
        default
        kind="subtitles"
        src="https://media.vimejs.com/subs/english.vtt"
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
