```html {9-11,26,36} title="example.vue"
<template>
  <Player>
    <!-- ... -->
    <Ui>
      <!-- ... -->
      <Settings>
        <Submenu label="Playback Rate">
          <MenuRadioGroup value="1">
            <MenuRadio label="0.5" value="0.5" />
            <MenuRadio label="Normal" value="1" />
            <MenuRadio label="2" value="2" />
          </MenuRadioGroup>
        </Submenu>
      </Settings>
    </Ui>
  </Player>
</template>

<script>
  import {
    Player,
    Ui,
    Settings,
    Submenu,
    MenuRadioGroup,
    MenuRadio,
  } from '@vime/vue';

  export default {
    components: {
      Player,
      Ui,
      Settings,
      Submenu,
      MenuRadioGroup,
      MenuRadio,
    },
  };
</script>
```
