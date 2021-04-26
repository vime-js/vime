```tsx {2,20-28}
import React, { useState } from "react";
import { Player, Ui, Menu } from "@vime/react";

function Example() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const onOpen = () => {
    setIsMenuActive(true);
  };

  const onClose = () => {
    setIsMenuActive(false);
  };

  return (
    <Player>
      {/* ... */}
      <Ui>
        {/* ... */}
        <Menu
          identifer="menu-id"
          controller="menu-controller-id"
          active={isMenuActive}
          onVmOpen={onOpen}
          onVmClose={onClose}
        >
          <!-- ... -->
        </Menu>
      </Ui>
    </Player>
  );
}
```
