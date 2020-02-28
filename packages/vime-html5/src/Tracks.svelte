{#each tracks as track}
  <track
    default={track.default}
    src={track.src}
    srclang={track.srclang}
    kind={track.kind}
    label={track.label}
  />
{/each}

<script>
  export let tracks = [];
</script>