```html {8,21,30} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Controls>
        <Control>
          <Tooltip>Title</Tooltip>
        </Control>
      </Controls>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Controls,
    Control,
    Tooltip,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Controls,
      Control,
      Tooltip,
    },
  };
</script>
```
