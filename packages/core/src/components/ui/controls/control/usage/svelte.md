```tsx
<VimeControl
  keys="k"
  label={$i18n.playback}
  pressed={paused}
  on:click={onClick}
  bind:this={ref}
>
  <VimeIcon href={icon} />
  <VimeTooltip>{tooltip} (k)</VimeTooltip>
</VimeControl>
```

```html {4}
<script lang="ts">
  import {
    useInternalPlayerStore,
    VimeControl,
    VimeIcon,
    VimeTooltip,
  } from '@vime/svelte';

  let ref: VimeControl;

  const { paused, i18n } = useInternalPlayerStore(() => ref);

  const onClick = () => {
    $paused = !$paused;
  };

  $: icon = $paused ? '#vime-play' : '#vime-pause';
  $: tooltip = $paused ? $i18n.play : $i18n.pause;
</script>
```
