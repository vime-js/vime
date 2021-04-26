```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, ScrubberControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <ScrubberControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
