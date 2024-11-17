import React, { useState } from 'react';
import {
  Player,
  Video,
  DefaultUi,
  Settings,
  MenuItem,
  Submenu,
  MenuRadio,
  MenuRadioGroup,
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
    const radio = event.target as HTMLVmMenuRadioElement;
    setValue(radio.value);
  };

  return (
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

      <DefaultUi noSettings>
        <Settings>
          <MenuItem
            label="Menu Item 1"
            badge="BADGE"
            onClick={onMenuItem1Click}
          />
          <MenuItem
            label="Menu Item 2"
            hint="Hint"
            onClick={onMenuItem2Click}
          />
          <Submenu label="Submenu 1" hint={value}>
            <MenuRadioGroup value={value} onVmCheck={onCheck}>
              <MenuRadio label="Option 1" value="1" />
              <MenuRadio label="Option 2" value="2" />
              <MenuRadio label="Option 3" value="3" />
            </MenuRadioGroup>
          </Submenu>
          <Submenu label="Submenu 2">Random content in here.</Submenu>
        </Settings>
      </DefaultUi>
    </Player>
  );
};

export default CustomSettingsPlayer;
