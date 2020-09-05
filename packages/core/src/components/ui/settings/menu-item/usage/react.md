```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeSettings, VimeMenuItem } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSettings>
          <VimeMenuItem label="Playback Quality" hint="Auto" />
        </VimeSettings>
      </VimeUi>
    </VimePlayer>
  );
}
```
