import React from 'react';
import { Player, Video, DefaultUi } from '@vime/react';

const BasicPlayer = ({ showDefaultUi = false, defaultUiProps = {} }) => (
  <Player controls={!showDefaultUi}>
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

    {showDefaultUi && <DefaultUi {...defaultUiProps} />}
  </Player>
);

export default BasicPlayer;
