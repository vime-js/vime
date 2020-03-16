<div class="container">
  <div class="component">
    <svelte:component 
      this={Component} 
      {...$$restProps}
      bind:this={component}
    />
  </div>
</div>

<script>
  let component;

  export let Component;

  export const getComponent = () => component;
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
    max-width: 960px;
    padding: 16px;
  }

  @media screen and (min-width: 480px) {
    .component {
      padding: 40px;
    }
  }
</style>