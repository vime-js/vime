```html {6,9,15,20,26} title="example.vue"
<template>
  <!-- Change the icons property to the name of the library you'd like to use. -->
  <Player icons="material">
    <!-- ... -->
    <Ui>
      <!-- Register a custom icon library. -->
      <IconLibrary name="my-library" :resolver="customResolver" />
    </Ui>
  </Player>
</template>

<script>
  import { Player, Ui, IconLibrary } from "@vime/vue";

  export default {
    data() {
      return {
        customResolver: (iconName) => `/icons/${iconName}.svg`,
      };
    },
    components: {
      Player,
      Ui,
      IconLibrary,
    },
  };
</script>
```
