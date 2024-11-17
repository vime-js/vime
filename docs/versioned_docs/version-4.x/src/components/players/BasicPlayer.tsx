import React from 'react';
import { Player, Video, DefaultUi } from '@vime/react';

const BasicPlayer = ({ showDefaultUi = false, defaultUiProps = {} }) => (
  <Player controls={!showDefaultUi}>
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

    {showDefaultUi && <DefaultUi {...defaultUiProps} />}
  </Player>
);

export default BasicPlayer;
