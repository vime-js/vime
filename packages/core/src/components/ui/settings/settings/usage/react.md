```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeSettings } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeSettings>{/* ... */}</VimeSettings>
      </VimeUi>
    </VimePlayer>
  );
}
```
