```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeSettings, VimeSubmenu } from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSettings>
          <VimeSubmenu label="Title">{/* ... */}</VimeSubmenu>
        </VimeSettings>
      </VimeUi>
    </VimePlayer>
  );
}
```
