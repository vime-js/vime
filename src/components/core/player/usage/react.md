```tsx {2,31-43}
import React, { useState, useRef } from 'react';
import { Player, Ui } from '@vime/react';

function Example() {
  const player = useRef<HTMLVmPlayerElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // If you prefer hooks ...
  // const [currentTime, setCurrentTime] = usePlayerContext(player, 'currentTime', 0);

  // Example function to showcase updating property.
  const seekForward = () => {
    setCurrentTime(currentTime + 5);
  };

  // Example function to showcase calling player method.
  const enterFullscreen = () => {
    player.current!.enterFulllscreen();
  };

  const onTimeUpdate = (event: CustomEvent<number>) => {
    setCurrentTime(event.detail);
  };

  const onFullscreenChange = (event: CustomEvent<boolean>) => {
    const isFullscreen = event.detail;
    // ...
  };

  return (
    <Player
      controls
      autoplay
      muted
      ref={player}
      currentTime={currentTime}
      onVmCurrentTimeChange={onTimeUpdate}
      onVmFullscreenChange={onFullscreenChange}
    >
      {/* Provider component is placed here. */}

      <Ui>{/* UI components are placed here. */}</Ui>
    </Player>
  );
}
```
