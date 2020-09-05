```tsx {6,18-20,22-25}
import React from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimeControlGroup,
  VimeScrubberControl,
  VimePlaybackControl,
  VimeVolumeControl,
} from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        <VimeControls fullWidth>
          <VimeControlGroup>
            <VimeScrubberControl />
          </VimeControlGroup>

          <VimeControlGroup space="top">
            <VimePlaybackControl />
            <VimeVolumeControl />
          </VimeControlGroup>
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
