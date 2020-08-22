```tsx {2,28-40}
import React, { useState } from 'react';
import { VimePlayer, VimeUi } from '@vime/react';

function Example() {
  const player = useRef<HTMLVimePlayerElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Example function to showcase updating property.
  const seekForward = () => {
    setCurrentTime(currentTime + 5);
  };

  // Example function to showcase calling player method.
  const enterFullscreen = () => {
    player.enterFulllscreen();
  };

  const onTimeUpdate = (event: CustomEvent<number>) => {
    setCurrentTime(event.detail);
  };

  const onFullscreenChange = (event: CustomEvent<boolean>) => {
    const isFullscreen = event.detail;
    // ...
  };

  return render(
    <VimePlayer
      controls
      autoplay
      muted
      ref={player}
      currentTime={currentTime}
      onVCurrentTimeChange={onTimeUpdate}
      onVFullscreenChange={onFullscreenChange}
    >
      {/* Provider component is placed here. */}

      <VimeUi>{/* UI components are placed here. */}</VimeUi>
    </VimePlayer>
  );
}
```
