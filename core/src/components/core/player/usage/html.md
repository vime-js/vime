```html
<vm-player controls autoplay muted current-time="30">
  <!-- Provider component is placed here. -->

  <vm-ui>
    <!-- UI components are placed here. -->
  </vm-ui>
</vm-player>

<script>
  const player = document.querySelector('vm-player');

  // Listening to an event.
  player.addEventListener('vmCurrentTimeChange', (event) => {
    const currentTime = event.detail;
    // ...
  });

  // Example function to showcase updating property.
  const seekForward = () => {
    player.currentTime += 5;
  };

  // Example function to showcase calling player method.
  const enterFullscreen = () => {
    player.enterFullscreen();
  };
</script>
```
