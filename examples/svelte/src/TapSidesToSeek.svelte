<script lang="ts">
  import { usePlayerStore } from "@vime/svelte";

  /**
   * We need a reference to a DOM element so the store works as it relies on dispatching 
   * custom DOM events.
   */
  let ref: HTMLDivElement;

  const { currentTime, duration } = usePlayerStore(() => ref)

  const onSeekBackward = () => {
    if ($currentTime < 5) return;
    $currentTime -= 5;
  };

  const onSeekForward = () => {
    if ($currentTime > ($duration - 5)) return;
    $currentTime += 5;
  };
</script>

<div class="tapSidesToSeek" bind:this={ref}>
  <div class="tapTarget backward" on:click={onSeekBackward} />
  <div class="spacer" />
  <div class="tapTarget forward" on:click={onSeekForward} />
</div>

<style>
  .tapSidesToSeek {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* 
      Why 21? Simply because it's one index above the `ClickToPlay` component. Click the link
      below and scroll down to the `Z-Index` section to see existing levels.

      @see https://github.com/vime-js/vime/blob/master/packages/core/src/globals/themes/default.css
    */
    z-index: 21;
    pointer-events: none;
  }

  .tapSidesToSeek > .spacer {
    flex: 1;
  }

  .tapSidesToSeek > .tapTarget {
    width: 7.5%;
    height: 100%;
    pointer-events: auto;
  }
</style>