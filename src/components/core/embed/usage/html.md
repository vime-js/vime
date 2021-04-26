```html
<vm-embed
  embed-src="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
  params="autoplay=1&muted=1&controls=0"
  media-title="Agent 327: Operation Barbershop"
  origin="https://www.youtube-nocookie.com"
/>

<script>
  const embed = document.querySelector('vm-embed');

  embed.addEventListener('vmEmbedMessage', e => {
    const message = e.detail;
    // ...
  });
</script>
```
