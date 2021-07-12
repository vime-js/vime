```tsx {5-13}
<Player>
  <!-- ... -->
  <Ui>
    <!-- ... -->
    <Menu
      identifer="menu-id"
      controller="menu-controller-id"
      active={isMenuActive}
      on:vmOpen={onOpen}
      on:vmClose={onClose}
    >
      <!-- ... -->
    </Menu>
  </Ui>
</Player>
```

```html {2}
<script lang="ts">
  import { Player, Ui, Menu } from '@vime/svelte';

  let isMenuActive = false;

  const onOpen = () => {
    isMenuActive = true;
  };

  const onClose = () => {
    isMenuActive = false;
  };
</script>
```
