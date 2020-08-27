```tsx
<VimeSlider
  label="Volume"
  step={5}
  max={100}
  value={value}
  on:vValueChange={onValueChange}
/>
```

```html {2}
<script lang="ts">
  import { VimeSlider } from '@vime/svelte';

  let value = 50;

  const onValueChange = (event: CustomEvent<number>) => {
    value = event.detail;
  };
</script>
```
