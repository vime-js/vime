```tsx {2,14-16}
import React from 'react';
import { VimePlayer, VimeHls } from '@vime/react';

function Example() {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };

  return (
    <VimePlayer controls>
      <VimeHls version="latest" config={hlsConfig} poster="/media/poster.png">
        <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
      </VimeHls>
      {/* ... */}
    </VimePlayer>
  );
}
```
