```tsx {2,14-18}
import React from 'react';
import { VimePlayer, VimeHls } from '@vime/react';

function Example() {
  /**
   * @see https://hls-js.netlify.app/api-docs/file/src/config.ts.html.
   */
  const hlsConfig = {
    // ...
  };

  return render(
    <VimePlayer controls>
      <VimeHls version="latest" config={hlsConfig} poster="/media/poster.png">
        <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
        <track default kind="subtitles" src="/media/subs/en.vtt" srclang="en" />
        {/* ... */}
      </VimeHls>
      {/* ... */}
    </VimePlayer>
  );
}
```
