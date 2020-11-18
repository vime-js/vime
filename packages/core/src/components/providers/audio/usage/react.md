```tsx {2,7-10}
import React from 'react';
import { Player, Audio } from '@vime/react';

function Example() {
  return (
    <Player controls>
      <Audio>
        <source data-src="/media/audio.mp3" type="audio/mp3" />
        {/* <source> and <track> elements are placed here. */}
      </Audio>
      {/* ... */}
    </Player>
  );
}
```
