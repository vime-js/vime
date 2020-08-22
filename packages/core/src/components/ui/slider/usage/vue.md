```html title="example.vue"
<template>
  <VimeSlider
    step="5"
    max="100"
    label="Volume"
    :value="value"
    @vValueChange="onValueChange"
  />
</template>

<script>
  import { VimeSlider } from '@vime/vue';

  export default {
    components: {
      VimeSlider,
    },

    data: {
      value: 50,
    },

    methods: {
      onValueChange(value) {
        this.value = value;
      },
    },
  };
</script>
```
