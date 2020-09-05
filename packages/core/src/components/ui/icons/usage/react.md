```tsx {2,10}
import React from "react";
import { VimePlayer, VimeUi, VimeIcons } from "@vime/react";

function Example() {
  return (
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeIcons href="/icons/sprite.svg">
      </VimeUi>
    </VimePlayer>
  );
}
```
