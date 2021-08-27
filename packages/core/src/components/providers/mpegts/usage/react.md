```tsx {2,14-16}
import React from 'react';
import { Player, Mpegts } from '@vime/react';

function Example() {
  /**
   * @see https://github.com/xqq/mpegts.js/blob/master/docs/api.md.
   */
  const mpegtsConfig = {
    // ...
  };

  return (
    <Player controls>
      <Mpegts version="latest" config={mpegtsConfig} poster="/media/poster.png" url="url" type="flv"></Mpegts>
      {/* ... */}
    </Player>
  );
}
```
