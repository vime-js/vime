```tsx {2,10,13}
import React from "react";
import { Player, Ui, IconLibrary } from "@vime/react";

function Example() {
  return (
    {/* Change the icons property to the name of the library you'd like to use. */}
    <Player icons="material">
      {/* ... */}
      <Ui>
        {/* Register a custom icon library. */}
        <IconLibrary name="my-library" resolver={(iconName) => `/icons/${iconName}.svg`}  />
      </Ui>
    </Player>
  );
}
```
