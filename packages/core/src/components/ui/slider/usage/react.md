```tsx
import React, { useState } from 'react';
import { VimeSlider } from '@vime/react';

function Example() {
  const [value, setValue] = useState(50);

  const onValueChange = (event: CustomEvent<number>) => {
    setValue(event.detail);
  };

  return render(
    <VimeSlider
      step="5"
      max="100"
      label="Volume"
      value={value}
      onVValueChange={onValueChange}
    />
  );
}
```
