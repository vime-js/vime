import React from 'react';
import {
  Player,
  Video,
  DefaultUi,
  Scrim,
  Controls,
  ControlSpacer,
  MuteControl,
  PlaybackControl,
  TimeProgress,
} from '@vime/react';

const CustomControlsPlayer = () => (
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
      <Scrim />

      <Controls fullWidth pin="topLeft">
        <ControlSpacer />
        <MuteControl />
      </Controls>

      <Controls pin="center" justify="center">
        {/* @ts-ignore */}
        <PlaybackControl hideTooltip style={{ '--vm-control-scale': 1.7 }} />
      </Controls>

      <Controls fullWidth pin="bottomLeft">
        <ControlSpacer />
        <TimeProgress />
      </Controls>
    </DefaultUi>
  </Player>
);

export default CustomControlsPlayer;
