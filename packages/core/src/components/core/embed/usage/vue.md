```html {2-8,12,16} title="example.vue"
<template>
  <VimeEmbed
    embedSrc="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
    mediaTitle="Agent 327: Operation Barbershop"
    origin="https://www.youtube-nocookie.com"
    :params="params"
    @vEmbedMessage="onMessage"
  />
</template>

<script>
  import { VimeEmbed } from '@vime/vue';

  export default {
    components: {
      VimeEmbed,
    },

    data: {
      params: {
        autoplay: 1,
        muted: 1,
        controls: 0,
      },
    },

    methods: {
      onMessage(message: any) {
        // ...
      },
    },
  };
</script>
```
