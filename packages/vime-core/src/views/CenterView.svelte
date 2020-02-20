<div class="container">
  <div class="component">
    <svelte:component this={Component} {...$$props} />
  </div>
</div>

<script>
  export let Component
</script>

<style>
  .container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .component {
    width: 100%;
    max-width: 1280px;
    padding: 16px;
  }

  @media screen and (min-width: 480px) {
    .component {
      padding: 40px;
    }
  }
</style>