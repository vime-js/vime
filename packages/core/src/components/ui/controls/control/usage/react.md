```tsx {4,25-34}
import React, { useMemo, useRef } from 'react';
import {
  PlayerProp,
  VimeControl,
  VimeIcon,
  VimeTooltip,
  useInternalPlayerContext,
} from '@vime/react';

function PlaybackControl() {
  const ref = useRef(null);
  const [paused, setPaused] = useInternalPlayerContext(
    ref,
    PlayerProp.Paused,
    true
  );
  const [i18n] = useInternalPlayerContext(ref, PlayerProp.i18n, {});
  const icon = useMemo(() => (paused ? '#vime-play' : '#vime-pause'), [paused]);
  const tooltip = useMemo(() => (paused ? 'Play' : 'Pause'), [paused]);
  const onClick = () => {
    setPaused(false);
  };

  return render(
    <VimeControl
      keys="k"
      ref={ref}
      label={i18n.playback}
      pressed={paused}
      onClick={onClick}
    >
      <VimeIcon href={icon} />
      <VimeTooltip>{tooltip} (k)</VimeTooltip>
    </VimeControl>
  );
}
```
