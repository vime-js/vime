```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeDefaultSettings } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeDefaultSettings />
      </VimeUi>
    </VimePlayer>
  );
}
```
