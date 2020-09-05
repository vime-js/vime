```tsx {8,20}
import React from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimePlaybackControl,
  VimeVolumeControl,
  VimeControlSpacer,
  VimeFullscreenControl,
} from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        <VimeControls fullWidth>
          <VimePlaybackControl />
          <VimeVolumeControl />
          <VimeControlSpacer />
          <VimeFullscreenControl />
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
