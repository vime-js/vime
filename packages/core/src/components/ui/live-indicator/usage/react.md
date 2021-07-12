```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, LiveIndicator } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <LiveIndicator />
        </Controls>
      </Ui>
    </Player>
  );
}
```
