```tsx {2,8,11}
import React from 'react';
import { Icon } from '@vime/react';

function Example() {
  return (
    <div>
      {/* Src. */}
      <Icon src="/icons/my-icon.svg" label="An icon" />

      {/* Icon library. */}
      <Icon name="play" library="material" label="Play" />
    </div>
  );
}
```
