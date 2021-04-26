```tsx {6,16}
import React from 'react';
import { Player, Ui, Controls, CaptionControl } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <CaptionControl />
        </Controls>
      </Ui>
    </Player>
  );
}
```
