```tsx {2,10}
import React from 'react';
import { Player, Ui, DefaultControls } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <DefaultControls activeDuration={3200} />
      </Ui>
    </Player>
  );
}
```
