<li>
  <MenuControl 
    role="menuitemradio"
    title={title}
    badge={badge}
    aria-label={title}
    aria-checked={isChecked}
    on:click="{() => dispatch('valuechange', value)}"
  />
</li>

<script>
  import { createEventDispatcher } from 'svelte'
  import MenuControl from './MenuControl.svelte'

  const dispatch = createEventDispatcher()

  export let title
  export let value
  export let group
  export let badge = null

  $: isChecked = (group === value)
</script>