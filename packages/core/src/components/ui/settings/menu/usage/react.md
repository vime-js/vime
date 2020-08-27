```tsx {2,20-28}
import React, { useState } from "react";
import { VimePlayer, VimeUi, VimeMenu } from "@vime/react";

function Example() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const onOpen = () => {
    setIsMenuActive(true);
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeMenu
          identifer="menu-id"
          controller="menu-controller-id"
          active={isMenuActive}
          onVOpen={onOpen}
          onVClose={onClose}
        >
          <!-- ... -->
        </VimeMenu>
      </VimeUi>
    </VimePlayer>
  );
}
```
