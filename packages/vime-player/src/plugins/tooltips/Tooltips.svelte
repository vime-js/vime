<svelte:options accessors />

<script context="module">
  export const ID = 'vTooltips'
</script>

<script>
  import { onDestroy, createEventDispatcher } from 'svelte'
  import { is_instance_of } from '~utils/unit'
  import Tooltip from './Tooltip.svelte'

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  export let player

  const registry = player.createRegistry(ID)
  const logger = player.createLogger(ID)
  const dispatch = createEventDispatcher()
  const { isMobile, isTouch } = player.getGlobalStore()

  const validateTooltip = (id, tooltip) => {
    if (!tooltip || !is_instance_of(tooltip, Tooltip)) {
      logger.warn(
        `attempted to register tooltip with \`id\` [${id}] but received invalid ` +
        'value, must be an instance of `Tooltip.svelte`'
      )
      return false
    }
    return true
  }

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  export let resolve = true
  export let isEnabled = true
  export let showHint = true

  export const create = () => Tooltip
  export const getTooltip = id => $registry[id]
  export const getTooltips = () => $registry
  export const deregister = id => { registry.deregister(id) }

  export const register = (id, tooltip) => {
    if (!validateTooltip(id, tooltip)) return
    registry.register(id, tooltip)
    tooltip.isEnabled = isEnabled
  }

  $: if (resolve) isEnabled = !$isMobile && !$isTouch

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  $: Object.values($registry).forEach(tooltip => { tooltip.isEnabled = isEnabled })
  $: Object.values($registry).forEach(tooltip => { tooltip.showHint = showHint })

  $: dispatch('isenabled', isEnabled)
  $: dispatch('showhint', showHint)
</script>