```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, SettingsControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <SettingsControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
