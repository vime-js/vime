```tsx {2,12-18}
import React, { useState } from "react";
import { VimePlayer, VimeUi, VimeMenu } from "@vime/react";

function Example() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  return render(
    <VimePlayer>
      {/* ... */}
      <VimeUi>
        {/* ... */}
        <VimeMenu
          identifer="menu-id"
          controller="menu-controller-id"
          active={isMenuActive}
        >
          <!-- ... -->
        </VimeMenu>
      </VimeUi>
    </VimePlayer>
  );
}
```
