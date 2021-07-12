```html {2-8,12,16} title="example.vue"
<template>
  <Slider
    label="Volume"
    :step="5"
    :max="100"
    :value="value"
    @vmValueChange="onValueChange"
  />
</template>

<script>
  import { Slider } from '@vime/vue';

  export default {
    components: {
      Slider,
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
