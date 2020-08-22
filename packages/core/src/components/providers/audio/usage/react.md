```tsx {2,7-10}
import React from 'react';
import { VimePlayer, VimeAudio } from '@vime/react';

function Example() {
  return render(
    <VimePlayer controls>
      <VimeAudio>
        <source data-src="/media/audio.mp3" type="audio/mp3" />
        {/* <source> and <track> elements are placed here. */}
      </VimeAudio>
      {/* ... */}
    </VimePlayer>
  );
}
```
