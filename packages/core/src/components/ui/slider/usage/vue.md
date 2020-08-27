```html {2-8,12,16} title="example.vue"
<template>
  <VimeSlider
    label="Volume"
    :step="5"
    :max="100"
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
