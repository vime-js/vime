```tsx {7,18}
import React from 'react';
import {
  Player,
  Ui,
  Controls,
  Control,
  Tooltip,
} from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Controls>
          <Control>
            <Tooltip>Title</Tooltip>
          </Control>
        </Controls>
      </Ui>
    </Player>
  );
}
```
