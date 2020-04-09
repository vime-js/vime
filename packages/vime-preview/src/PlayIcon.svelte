<svg 
  xmlns="http://www.w3.org/2000/svg"
  bind:this={svg}
>
  <path d="M3 1.52c0-.398.644-.637.977-.418L15 8.662a.5.5 0 010 .835L3.977 16.911c-.333.219-.977-.02-.977-.418V1.52z"/>
</svg>

<script>
  let svg;

  export let scale = 2;

  $: if (svg) svg.style.transform = `scale(${scale}`;
</script>

<style>
  svg {
    display: block;
    fill: currentColor;
    pointer-events: none;
    width: 18px;
    height: 18px;
    color: #fff;
    opacity: 80%;
  }
</style>