```tsx {2,14-16}
import React from 'react';
import { Player, Hls } from '@vime/react';

function Example() {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };

  return (
    <Player controls>
      <Hls version="latest" config={hlsConfig} poster="/media/poster.png">
        <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
      </Hls>
      {/* ... */}
    </Player>
  );
}
```
