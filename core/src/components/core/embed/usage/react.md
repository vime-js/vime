```tsx {2,11-17}
import React from 'react';
import { Embed } from '@vime/react';

function Example() {
  const onMessage = (event: CustomEvent<any>) => {
    const message = event.detail;
    // ...
  };

  return (
    <Embed
      embedSrc="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
      params={{ autoplay: 1, muted: 1, controls: 0 }}
      mediaTitle="Agent 327: Operation Barbershop"
      origin="https://www.youtube-nocookie.com"
      onVmEmbedMessage={onMessage}
    />
  );
}
```
