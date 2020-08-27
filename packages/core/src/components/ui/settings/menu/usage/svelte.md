```tsx {5-13}
<VimePlayer>
  <!-- ... -->
  <VimeUi>
    <!-- ... -->
    <VimeMenu
      identifer="menu-id"
      controller="menu-controller-id"
      active={isMenuActive}
      on:vOpen={onOpen}
      on:vClose={onClose}
    >
      <!-- ... -->
    </VimeMenu>
  </VimeUi>
</VimePlayer>
```

```html {2}
<script lang="ts">
  import { VimePlayer, VimeUi, VimeMenu } from '@vime/svelte';

  let isMenuActive = false;

  const onOpen = () => {
    isMenuActive = true;
  };

  const onClose = () => {
    isMenuActive = false;
  };
</script>
```
