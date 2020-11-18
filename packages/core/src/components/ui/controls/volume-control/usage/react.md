```tsx {6,16}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  VolumeControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <VolumeControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
