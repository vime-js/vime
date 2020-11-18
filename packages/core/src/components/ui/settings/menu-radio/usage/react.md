```tsx {8,20-22}
import React from 'react';
import {
  Player,
  Ui,
  Settings,
  Submenu,
  MenuRadioGroup,
  MenuRadio,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Settings>
          <Submenu label="Playback Rate">
            <MenuRadioGroup value="1">
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
