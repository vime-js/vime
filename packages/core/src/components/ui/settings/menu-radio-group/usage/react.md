```tsx {7,26-30}
import React, { useState } from 'react';
import {
  Player,
  Ui,
  Settings,
  Submenu,
  MenuRadioGroup,
  MenuRadio,
} from '@vime/react';

function Example() {
  const [value, setValue] = useState('1');

  const onValueChange = (event: Event) => {
    const radio = event.target as HTMLVmMenuRadioElement;
    setValue(radio.value);
  };

  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Settings>
          <Submenu label="Playback Rate">
            <MenuRadioGroup value={value} onVmCheck={onValueChange}>
              <MenuRadio label="0.5" value="0.5" />
              <MenuRadio label="Normal" value="1" />
              <MenuRadio label="2" value="2" />
            </MenuRadioGroup>
          </Submenu>
        </Settings>
      </Ui>
    </Player>
  );
}
```
