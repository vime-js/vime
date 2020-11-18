```tsx {3,24-33}
import React, { useMemo, useRef } from 'react';
import {
  Control,
  Icon,
  Tooltip,
  usePlayerContext,
} from '@vime/react';

function PlaybackControl() {
  const ref = useRef(null);
  const [paused, setPaused] = usePlayerContext(ref, 'paused', true);
  const [i18n] = usePlayerContext(ref, 'i18n', {});
  const icon = useMemo(() => (paused ? 'play' : 'pause'), [paused]);
  const tooltip = useMemo(() => (paused ? i18n.play : i18n.pause), [
    paused, 
    i18n,
  ]);
  
  const onClick = () => { 
    setPaused(false); 
  };

  return (
    <Control
      keys="k"
      ref={ref}
      label={i18n.playback}
      pressed={paused}
      onClick={onClick}
    >
      <Icon name={icon} />
      <Tooltip>{tooltip} (k)</Tooltip>
    </Control>
  );
}
```
