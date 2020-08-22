```html
<vime-player controls autoplay muted current-time="30">
  <!-- Provider component is placed here. -->

  <vime-ui>
    <!-- UI components are placed here. -->
  </vime-ui>
</vime-player>

<script>
  const player = document.querySelector('vime-player');

  // Listening to an event.
  player.addEventListener('vCurrentTimeChange', (event) => {
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
