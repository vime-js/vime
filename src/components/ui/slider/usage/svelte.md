```tsx
<Slider
  label="Volume"
  step={5}
  max={100}
  value={value}
  on:vmValueChange={onValueChange}
/>
```

```html {2}
<script lang="ts">
  import { Slider } from '@vime/svelte';

  let value = 50;

  const onValueChange = (event: CustomEvent<number>) => {
    value = event.detail;
  };
</script>
```
