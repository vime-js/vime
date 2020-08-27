```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeDefaultControls } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeDefaultControls fullWidth activeDuration={3200} />
      </VimeUi>
    </VimePlayer>
  );
}
```
