<div class="uk-width-1-1 uk-height-1-1 uk-flex uk-flex-center uk-flex-middle uk-flex-column">
  <div class="uk-width-1-1" style={small ? 'max-width: 480px;' : 'max-width: 960px;'}>
    <slot />
  </div>
</div>

<script>
  export let small = false;
</script>