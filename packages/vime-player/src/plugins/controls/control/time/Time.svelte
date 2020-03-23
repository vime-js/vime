<div aria-label={$$props['aria-label']}>
  {format_time(Math.max(0, seconds))}
</div>

<script>
  import { format_time } from '@vime-js/utils';

  export let seconds = 0;
</script>

<style type="text/scss">
  @import '../../../../style/common';

  div {
    font-size: $time-font-size;
    font-weight: $time-font-weight;
    display: inline-block;
  }
</style>