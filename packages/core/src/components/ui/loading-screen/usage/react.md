```tsx {2,10-12}
import React from 'react';
import { Player, Ui, LoadingScreen } from '@vime/react';

function Example() {
  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <LoadingScreen>
          {/* Pass in content here such as a logo (optional). */}
        </LoadingScreen>
      </Ui>
    </Player>
  );
}
```
