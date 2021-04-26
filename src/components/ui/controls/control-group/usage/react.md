```tsx {6,18-20,22-25}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  ControlGroup,
  ScrubberControl,
  PlaybackControl,
  VolumeControl,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        <Controls fullWidth>
          <ControlGroup>
            <ScrubberControl />
          </ControlGroup>

          <ControlGroup space="top">
            <PlaybackControl />
            <VolumeControl />
          </ControlGroup>
        </Controls>
      </Ui>
    </Player>
  );
}
```
