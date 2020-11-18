```html {4,7,12,16} title="example.vue"
<template>
  <div>
    <!-- Src. -->
    <Icon src="/icons/my-icon.svg" label="An icon" />

    <!-- Icon library. -->
    <Icon name="pause" library="material" label="Pause" />
  </div>
</template>

<script>
  import { Icon } from '@vime/vue';

  export default {
    components: {
      Icon,
    },
  };
</script>
```
