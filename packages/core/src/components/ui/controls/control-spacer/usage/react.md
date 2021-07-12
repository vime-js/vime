```tsx {8,20}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  PlaybackControl,
  VolumeControl,
  ControlSpacer,
  FullscreenControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        <Controls fullWidth>
          <PlaybackControl />
          <VolumeControl />
          <ControlSpacer />
          <FullscreenControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
