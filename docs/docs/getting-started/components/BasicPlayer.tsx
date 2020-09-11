import React from 'react';
import { VimePlayer, VimeVideo, VimeDefaultUi } from '@vime/react';

export const BasicPlayer = ({ 
  showDefaultUi = false,
  defaultUiProps = {}
}) => (
  <VimePlayer controls={!showDefaultUi}>
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

    {showDefaultUi && <VimeDefaultUi {...defaultUiProps} />}
  </VimePlayer>
);