```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeSkeleton } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSkeleton />
      </VimeUi>
    </VimePlayer>
  );
}
```
