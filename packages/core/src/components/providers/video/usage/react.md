```tsx {2,7-23}
import React from 'react';
import { VimePlayer, VimeVideo } from '@vime/react';

function Example() {
  return render(
    <VimePlayer controls>
      <VimeVideo>
        <source data-src="/media/video.mp4" type="video/mp4" />
        <track
          default
          kind="subtitles"
          src="/media/subs/en.vtt"
          srclang="en"
          label="English"
        />
        <track
          kind="captions"
          src="/media/caps/es.vtt"
          srclang="es"
          label="Spanish"
        />
        {/* ... */}
      </VimeVideo>
      {/* ... */}
    </VimePlayer>
  );
}
```
