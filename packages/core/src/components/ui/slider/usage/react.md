```tsx {2,12-18}
import React, { useState } from 'react';
import { VimeSlider } from '@vime/react';

function Example() {
  const [value, setValue] = useState(50);

  const onValueChange = (event: CustomEvent<number>) => {
    setValue(event.detail);
  };

  return (
    <VimeSlider
      label="Volume"
      step={5}
      max={100}
      value={value}
      onVValueChange={onValueChange}
    />
  );
}
```
