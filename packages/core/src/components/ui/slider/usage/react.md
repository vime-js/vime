```tsx {2,12-18}
import React, { useState } from 'react';
import { Slider } from '@vime/react';

function Example() {
  const [value, setValue] = useState(50);

  const onValueChange = (event: CustomEvent<number>) => {
    setValue(event.detail);
  };

  return (
    <Slider
      label="Volume"
      step={5}
      max={100}
      value={value}
      onVmValueChange={onValueChange}
    />
  );
}
```
