```tsx {2,10}
import React from 'react';
import { VimePlayer, VimeUi, VimeCaptions } from '@vime/react';

function Example() {
  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeCaptions />
      </VimeUi>
    </VimePlayer>
  );
}
```
