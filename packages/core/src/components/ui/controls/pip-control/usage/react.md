```tsx {2,11}
import React from 'react';
import { VimePlayer, VimeUi, VimeControls, VimePipControl } from '@vime/react';

function Example() {
  return render(
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
