{#if $isLive}
  <div>{$i18n.live}</div>
{/if}

<script context="module">
  export const ID = 'vLiveIndicator';
  export const LABEL = 'liveStreamIndicator';
</script>

<script>
  export let player;

  const { isLive, i18n } = player.getStore();
</script>

<style type="text/scss">
  @import '../../../style/common';

  div {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: $font-weight-bold;
    letter-spacing: 0.6px;

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: red;
      margin-right: 4px;
    }
  }
</style>