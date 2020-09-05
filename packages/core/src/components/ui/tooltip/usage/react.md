```tsx {7,18}
import React from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimeControl,
  VimeTooltip,
} from '@vime/react';

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls>
          <VimeControl>
            <VimeTooltip>Title</VimeTooltip>
          </VimeControl>
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
