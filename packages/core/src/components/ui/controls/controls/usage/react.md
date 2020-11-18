```tsx {2,10-12}
import React from 'react';
import { Player, Ui, Controls } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls fullWidth activeDuration={3200}>
          {/* ... */}
        </Controls>
      </Ui>
    </Player>
  );
}
```
