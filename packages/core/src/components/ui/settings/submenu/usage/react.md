```tsx {2,11}
import React from 'react';
import { Player, Ui, Settings, Submenu } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Settings>
          <Submenu label="Title">{/* ... */}</Submenu>
        </Settings>
      </Ui>
    </Player>
  );
}
```
