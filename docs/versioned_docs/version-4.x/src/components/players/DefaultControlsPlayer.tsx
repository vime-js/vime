import React from 'react';
import { 
  VimePlayer, 
  VimeVideo, 
  VimeDefaultUi,
  VimeDefaultControls, 
} from '@vime/react';

const DefaultControlsPlayer = () => (
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

    <VimeDefaultUi noControls>
      <VimeDefaultControls
        hideOnMouseLeave
        activeDuration={2000}
      />
    </VimeDefaultUi>
  </VimePlayer>
);

export default DefaultControlsPlayer;