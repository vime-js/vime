```tsx
<VimeEmbed
  embedSrc="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
  origin="https://www.youtube-nocookie.com"
  mediaTitle="Agent 327: Operation Barbershop"
  params={params}
  on:vEmbedMessage={onMessage}
/>
```

```html {2}
<script lang="ts">
  import { VimeEmbed } from '@vime/svelte';

  const params = {
    autoplay: 1,
    muted: 1,
    controls: 0,
  };

  const onMessage = (event: CustomEvent<any>) => {
    const message = event.detail;
    // ...
  };
</script>
```
