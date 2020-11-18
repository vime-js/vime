```tsx {6,16}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  PlaybackControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <PlaybackControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
