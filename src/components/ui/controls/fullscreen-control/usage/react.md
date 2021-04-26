```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, FullscreenControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <FullscreenControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
