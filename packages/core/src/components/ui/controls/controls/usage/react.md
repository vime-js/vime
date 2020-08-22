```tsx {2,10-12}
import React from 'react';
import { VimePlayer, VimeUi, VimeControls } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls fullWidth activeDuration="3200">
          {/* ... */}
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
