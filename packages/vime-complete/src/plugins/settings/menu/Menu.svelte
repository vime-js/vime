<svelte:options accessors />

<svelte:window
  on:keydown={onWindowKeyDown}
  on:click="{() => { isActive = false; }}"
/>

<ul
  role="menu"
  tabindex="-1"
  aria-hidden={!isActive}
  {...$$restProps}
  on:click|stopPropagation
  on:keydown
  on:keydown|stopPropagation={onKeyDown}
  on:focus={onMenuOpen}
  bind:this={el}
>
  <slot />
</ul>

<script context="module">
  const Event = {
    OPEN: 'open',
    CLOSE: 'close',
  };
</script>

<script>
  import { tick, createEventDispatcher, onMount } from 'svelte';

  // --------------------------------------------------------------
  // Setup
  // --------------------------------------------------------------

  const dispatch = createEventDispatcher();

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
    DOWN: 40,
  });

  // --------------------------------------------------------------
  // Props
  // --------------------------------------------------------------

  let el;
  let choices;
  let focusedChoiceIndex = -1;

  export let isActive = false;

  export const getEl = () => el;
  export const getFocusedChoice = () => choices[focusedChoiceIndex];
  export const getFocusedChoiceIndex = () => focusedChoiceIndex;
  export const getChoices = () => choices;
  export const getSubmenu = (choice) => document.getElementById(choice.getAttribute('aria-controls'));
  
  export const focus = () => el.focus();
  
  export const focusChoice = (index) => {
    if (index === -1) {
      focusedChoiceIndex = choices.length - 1;
    } else if (index === choices.length) {
      focusedChoiceIndex = 0;
    } else {
      focusedChoiceIndex = index;
    }
    choices[focusedChoiceIndex].focus();
  };

  export const focusController = () => {
    const controller = document.getElementById($$props['aria-labelledby']);
    if (controller) controller.focus();
  };

  // --------------------------------------------------------------
  // Events
  // --------------------------------------------------------------

  const updateChoices = async () => {
    await tick();
    choices = document.querySelectorAll(`#${$$props.id} > li > button`);
  };

  onMount(updateChoices);

  const onWindowKeyDown = (e) => {
    if (e.keyCode === KeyCode.ESC) isActive = false;
  };

  const onMenuOpen = () => {
    updateChoices();
    focusedChoiceIndex = 0;
    // Prevents forwarding click event that opened the menu to the choice.
    setTimeout(() => { choices[focusedChoiceIndex].focus(); }, 10);
    isActive = true;
  };

  const onMenuClose = () => {
    focusedChoiceIndex = -1;
    focusController();
    isActive = false;
  };

  const onOpenSubmenu = async () => {
    const choice = choices[focusedChoiceIndex];
    choice.click();
    await tick();
    const submenu = getSubmenu(choice);
    if (submenu) submenu.focus();
  };

  const onKeyDown = (e) => {
    const { keyCode } = e;
    const isValidKeyCode = Object.values(KeyCode).includes(keyCode);

    if (isValidKeyCode) { e.preventDefault(); }

    switch (keyCode) {
      case KeyCode.ESC:
        onMenuClose();
        break;
      case KeyCode.DOWN:
      case KeyCode.TAB:
        focusChoice(focusedChoiceIndex + 1);
        break;
      case KeyCode.HOME: case KeyCode.PAGEUP:
        focusChoice(0);
        break;
      case KeyCode.END: case KeyCode.PAGEDOWN:
        focusChoice(choices.length - 1);
        break;
      case KeyCode.UP:
        focusChoice(focusedChoiceIndex - 1);
        break;
      case KeyCode.LEFT:
        onMenuClose();
        break;
      case KeyCode.ENTER: case KeyCode.SPACE:
        onOpenSubmenu();
        break;
      case KeyCode.RIGHT:
        onOpenSubmenu();
        break;
      default:
        break;
    }
  };

  $: dispatch(isActive ? Event.OPEN : Event.CLOSE);
</script>

<style type="text/scss">
  @import '../../../style/common';

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