<div aria-label={$$props['aria-label']}>
  {formatTime(Math.max(0, time))}
</div>

<script>
  import { formatTime } from '@vime/core';

  export let time;
</script>

<style type="text/scss">
  @import '../../../../style/common';

  div {
    font-size: $time-font-size;
    font-weight: $time-font-weight;
    display: inline-block;
  }
</style>