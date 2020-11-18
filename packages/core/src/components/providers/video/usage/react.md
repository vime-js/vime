```tsx {2,7-22}
import React from 'react';
import { Player, Video } from '@vime/react';

function Example() {
  return (
    <Player controls>
      <Video>
        <source data-src="/media/video.mp4" type="video/mp4" />
        <track
          default
          kind="subtitles"
          src="/media/subs/en.vtt"
          srcLang="en"
          label="English"
        />
        <track
          kind="captions"
          src="/media/caps/es.vtt"
          srcLang="es"
          label="Spanish"
        />
      </Video>
      {/* ... */}
    </Player>
  );
}
```
