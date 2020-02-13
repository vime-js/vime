<svelte:window
  on:keydown="{e => { if (e.keyCode === KeyCode.ESC) dispatchMenuClose() }}"
  on:click="{() => dispatchMenuClose()}"
/>

<ul
  id={$$props.id}
  role="menu"
  tabindex="-1"
  aria-hidden={$$props['aria-hidden']}
  aria-labelledby={$$props['aria-labelledby']}
  on:click|stopPropagation
  on:mousedown|preventDefault
  on:keydown={onKeyDown}
  on:focus={onMenuOpen}
  bind:this={ref}
>
  <slot />
</ul>

<script>
  import { tick, createEventDispatcher } from 'svelte'
  import { ctxKey } from '~src/context'

  const dispatch = createEventDispatcher()

  const KeyCode = Object.freeze({
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
  })

  let items
  let activeItem = 0
  
  // Two-way binding (readonly).
  export let ref = null

  const dispatchMenuClose = () => dispatch('menuclose')

  const setFocusToItem = index => {
    if (index === -1) index = items.length - 1
    if (index === items.length) index = 0
    activeItem = index
    items[activeItem].focus()
  }

  const setFocusToController = () => {
    const controller = document.getElementById($$props['aria-labelledby'])
    if (controller) controller.focus()
  }

  const getSubMenu = item => document.getElementById(item.getAttribute('aria-controls'))

  const onItemSelect = async () => {
    const item = items[activeItem]
    item.click()
    await tick()
    const subMenu = getSubMenu(item)
    if (subMenu) subMenu.focus()
  }

  const onMenuOpen = async () => {
    await tick()
    items = document.querySelectorAll(`#${$$props.id} > li > button`)
    // Prevents forwarding click event that opened the menu to the item.
    setTimeout(() => { items[activeItem].focus() }, 10)
  }

  const onMenuClose = () => {
    activeItem = 0
    dispatchMenuClose()
    setFocusToController()
  }

  const onOpenSubMenu = async () => {
    const item = items[activeItem]
    const subMenu = getSubMenu(item)
    if (!subMenu) return
    item.click()
    await tick()
    subMenu.focus()
  }

  const onKeyDown = e => {
    const keyCode = e.keyCode
    const isValidKeyCode = Object.values(KeyCode).includes(keyCode)
  
    if (isValidKeyCode) {
      e.preventDefault()
      e.stopPropagation()
    }

    switch (keyCode) {
      case KeyCode.ESC:
        onMenuClose()
        break
      case KeyCode.DOWN:
        setFocusToItem(activeItem + 1)
        break
      case KeyCode.TAB:
        onMenuClose()
        break
      case KeyCode.HOME: case KeyCode.PAGEUP:
        setFocusToItem(0)
        break
      case KeyCode.END: case KeyCode.PAGEDOWN:
        setFocusToItem(items.length - 1)
        break
      case KeyCode.UP:
        setFocusToItem(activeItem - 1)
        break
      case KeyCode.LEFT:
        onMenuClose()
        break
      case KeyCode.ENTER: case KeyCode.SPACE:
        onItemSelect()
        break
      case KeyCode.RIGHT:
        onOpenSubMenu()
        break
    }
  }
</script>

<style type="text/scss">
  @import '../../style/common';

  ul {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    padding: 0;
    font-size: $font-size-medium;
    font-weight: $font-weight-regular;
    position: relative;
    overflow: hidden;
    text-align: left;
    white-space: nowrap;
    z-index: 3;
    list-style-type: none;

    &[aria-hidden='true'] {
      display: none;
    }

    &:focus {
      outline: 0;
    }
  }
</style>