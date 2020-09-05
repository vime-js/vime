```tsx {2,14-19}
import React from 'react';
import { VimePlayer, VimeDash } from '@vime/react';

function Example() {
  /**
   * @see https://github.com/Dash-Industry-Forum/dash.js.
   */
  const dashConfig = {
    // ...
  };

  return (
    <VimePlayer controls>
      <VimeDash
        src="/media/manifest.mpd"
        version="latest"
        config={dashConfig}
        poster="/media/poster.png"
      />
      {/* ... */}
    </VimePlayer>
  );
}
```
