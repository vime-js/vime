import React from 'react';
import { 
  VimePlayer, 
  VimeVideo, 
  VimeUi, 
  VimeClickToPlay,
  VimeSpinner,
} from '@vime/react';
import TapSidesToSeek from './TapSidesToSeek';

export const ClickPlayer = () => (
  <VimePlayer>
    <VimeVideo crossOrigin="" poster="https://media.vimejs.com/poster.png">
      <source 
        data-src="https://media.vimejs.com/720p.mp4" 
        type="video/mp4" 
      />
      <track 
        default 
        kind="subtitles" 
        src="https://media.vimejs.com/subs/english.vtt" 
        srcLang="en" 
        label="English" 
      />
    </VimeVideo> 

    <VimeUi>
      <VimeClickToPlay />
      <VimeSpinner />
      <TapSidesToSeek />
    </VimeUi>
  </VimePlayer>
);