```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeControls, VimeMuteControl } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls>
          <VimeMuteControl />
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
