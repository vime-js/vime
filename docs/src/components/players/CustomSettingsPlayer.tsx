import React, { useState } from 'react';
import { 
  VimePlayer,
  VimeVideo, 
  VimeDefaultUi,
  VimeSettings,
  VimeMenuItem,
  VimeSubmenu,
  VimeMenuRadio,
  VimeMenuRadioGroup,
} from '@vime/react';

const CustomSettingsPlayer = () => {
  const [value, setValue] = useState('1');

  const onMenuItem1Click = () => {
    console.log('Clicked menu item 1');
  };
  
  const onMenuItem2Click = () => {
    console.log('Clicked menu item 2');
  };

  const onCheck = (event: Event) => {
    const radio = event.target as HTMLVimeMenuRadioElement;
    setValue(radio.value);
  };

  return (
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

      <VimeDefaultUi noSettings>
        <VimeSettings>
          <VimeMenuItem label="Menu Item 1" badge="BADGE" onClick={onMenuItem1Click} />
          <VimeMenuItem label="Menu Item 2" hint="Hint" onClick={onMenuItem2Click} />
          <VimeSubmenu label="Submenu 1" hint={value}>
            <VimeMenuRadioGroup value={value} onVCheck={onCheck}>
              <VimeMenuRadio label="Option 1" value="1" />
              <VimeMenuRadio label="Option 2" value="2" />
              <VimeMenuRadio label="Option 3" value="3" />
            </VimeMenuRadioGroup>
          </VimeSubmenu>
          <VimeSubmenu label="Submenu 2">
            Random content in here.
          </VimeSubmenu>
        </VimeSettings>
      </VimeDefaultUi>
    </VimePlayer>
  );
};

export default CustomSettingsPlayer;