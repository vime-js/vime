<div class="tapSidesToSeek" bind:this={ref}>
  <div class="tapTarget backward" on:click={onSeekBackward} />
  <div class="spacer" />
  <div class="tapTarget forward" on:click={onSeekForward} />
</div>

<script lang="ts">
  import { useInternalPlayerStore } from "@vime/svelte";

  /**
   * We need a reference to a DOM element so the store works as it relies on dispatching 
   * custom DOM events.
   */
  let ref: HTMLDivElement;

  /**
   * The internal player store gives us the ability to write to properties that are 
   * considered unsafe to write to from the "outside". Remember, with great power comes great 
   * responsibility.
   */ 
  const { currentTime, duration } = useInternalPlayerStore(() => ref)

  const onSeekBackward = () => {
    if ($currentTime < 5) return;
    $currentTime -= 5;
  };

  const onSeekForward = () => {
    if ($currentTime > ($duration - 5)) return;
    $currentTime += 5;
  };
</script>

<style>
  .tapSidesToSeek {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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