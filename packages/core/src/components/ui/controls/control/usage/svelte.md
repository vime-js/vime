```tsx
<Control
  keys="k"
  label={$i18n.playback}
  pressed={paused}
  on:click={onClick}
  bind:this={ref}
>
  <Icon name={icon} />
  <Tooltip>{tooltip} (k)</Tooltip>
</Control>
```

```html {4}
<script lang="ts">
  import { usePlayerStore, Control, Icon, Tooltip } from '@vime/svelte';

  let ref: Control;

  const { paused, i18n } = usePlayerStore(() => ref);

  const onClick = () => {
    $paused = !$paused;
  };

  $: icon = $paused ? 'play' : 'pause';
  $: tooltip = $paused ? $i18n.play : $i18n.pause;
</script>
```
