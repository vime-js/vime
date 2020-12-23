```tsx {5,8,13} title="example.svelte"
<!-- Change the icons property to the name of the library you'd like to use. -->
<Player icons="material">
  <!-- ... -->
  <Ui>
    <!-- Register a custom icon library. -->
    <IconLibrary name="my-library" resolver={(iconName) => `/icons/${iconName}.svg`}  />
  </Ui>
</Player>
```

```html
<script lang="ts">
  import { Player, Ui, IconLibrary } from '@vime/svelte';
</script>
```
