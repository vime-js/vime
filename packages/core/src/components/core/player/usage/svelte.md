```tsx
<Player
  controls
  autoplay
  muted
  ref={player}
  currentTime={currentTime}
  on:vmCurrentTimeChange={onTimeUpdate}
  on:vmFullscreenChange={onFullscreenChange}
>
  <!-- Provider component is placed here. -->

  <Ui><!-- UI components are placed here. --></Ui>
</Player>
```

```html {2}
<script lang="ts">
  import { Player, Ui, usePlayerStore } from '@vime/svelte';

  let player: Player;
  let currentTime = 0;

  // OPTIONAL: If you prefer you can use the player store.
  const { paused } = usePlayerStore(player);
  $paused = false;
  $: console.log($paused);

  // Example function to showcase updating property.
  const seekForward = () => {
    currentTime += 5;
  };

  // Example function to showcase calling player method.
  const enterFullscreen = () => {
    player.enterFullscreen();
  };

  const onTimeUpdate = (event: CustomEvent<number>) => {
    currentTime = event.detail;
  };

  const onFullscreenChange = (event: CustomEvent<boolean>) => {
    const isFullscreen = event.detail;
    // ...
  };
</script>
```
