```tsx {6,32-40}
import React, { useState } from 'react';
import {
  VimePlayer,
  VimeUi,
  VimeControls,
  VimeControl,
  VimeIcon,
  VimeTooltip,
} from '@vime/react';

function Example() {
  const [paused, setPaused] = useState(true);
  const [icon, setIcon] = useState('#vime-play');
  const [tooltip, setTooltip] = useState('Pause');

  const onClick = () => {
    onPausedChange({ detail: !paused });
  };

  const onPausedChange = (event: CustomEvent<boolean>) => {
    setPaused(event.detail);
    setIcon(paused ? '#vime-play' : '#vime-pause');
    setTooltip(paused ? 'Play' : 'Pause');
  };

  return render(
    <VimePlayer paused={paused} onVPausedChange={onPausedChange}>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeControls fullWidth>
          <VimeControl
            label="Playback"
            keys="k"
            pressed={paused}
            onClick={onClick}
          >
            <VimeIcon href={icon} />
            <VimeTooltip>{tooltip} (k)</VimeTooltip>
          </VimeControl>
        </VimeControls>
      </VimeUi>
    </VimePlayer>
  );
}
```
