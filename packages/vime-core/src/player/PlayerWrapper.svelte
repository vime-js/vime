<Lazy let:intersecting>
  {#if intersecting}
    <div use:setAspectRatio={aspectRatio}>
      <slot />
    </div>
  {/if}
</Lazy>

<script>
  import { Lazy } from '../components'
  import { aspectRatio as setAspectRatio } from '../actions'

  export let aspectRatio = null
</script>