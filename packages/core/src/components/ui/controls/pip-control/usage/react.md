```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeControls, VimePipControl } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls>
          <VimePipControl />
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
