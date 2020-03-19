<svelte:window 
  on:mouseup={stopDragging} 
  on:mousemove={onDragging} 
/>

<div class="canvas" bind:this={canvasEl}>
  <div class="view">
    <Center>
      <slot />
    </Center>
  </div>
  <div 
    class="interactives"
    class:hidden
    class:transitioning
    bind:this={interactivesEl}
  >
    <div 
      class="interactives-dragbar" 
      on:mousedown|preventDefault={startDragging}
    ></div>
    <button
      class="uk-icon-button interactives-toggle"
      on:click={onToggle}
    >
      <span uk-icon="icon: move;"></span>
    </button>
    <ul uk-tab>
      <li></li>
      <li><a href="#props">Props</a></li>
      <li><a href="#methods">Methods</a></li>
      <li><a href="#events">Events</a></li>
    </ul>
    <ul class="uk-switcher uk-margin interactives-body">
      <li>
        <PropsPanel
          {props} 
          on:change
        />
      </li>
      <li><MethodsPanel {props} /></li>
      <li><EventsPanel {events} /></li>
    </ul>
  </div>
</div>

<script>
  import { onMount } from 'svelte';
  import { raf } from 'svelte/internal';
  import Center from '../../components/Center.svelte';
  import PropsPanel from './panels/PropsPanel.svelte';
  import MethodsPanel from './panels/MethodsPanel.svelte';
  import EventsPanel from './panels/EventsPanel.svelte';

  let startX;
  let startWidth;
  let canvasEl;
  let interactivesEl;
  let hidden = false;
  let dragging = false;
  let transitioning = false;

  export let props = [];
  export let events = {};

  onMount(() => {
    const width = parseFloat(window.getComputedStyle(canvasEl).width);
    if (width < 760) hidden = true;
  });

  const onToggle = e => { 
    hidden = !hidden;
    transitioning = true;
    setTimeout(() => {
      transitioning = false;
    }, 400);
    e.target.blur();
  };

  const startDragging = e => { 
    dragging = true; 
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(interactivesEl).width);
  };
  
  const stopDragging = () => { dragging = false; };

  const onDraggingHandler = e => {
    interactivesEl.style.width = `${(startWidth - (e.clientX - startX))}px`;
  };

  $: onDragging = dragging ? onDraggingHandler : null;
</script>

<style>
  .canvas {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    background: #fff;
  }

  .canvas :global(input:focus) {
    border: 1px solid #1ea7fd;
  }

  .canvas :global(.uk-tab > .uk-active > a) {
    color: #1ea7fd;
    border-color: #22aaff; 
  }

  .canvas :global(.uk-checkbox:checked) {
    background-color: #1ea7fd;
  }

  .view {
    flex: 1;
    padding: 24px;
    position: relative;
  }

  .interactives {
    width: 300px;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    min-width: 300px;
    max-width: 60%;
  }

  @media (min-width: 959px) {
    .interactives {
      width: 350px;
    }
  }

  .interactives.transitioning {
    transition: 0.3s ease-out width, 0.3s ease-out min-width;
  }

  .interactives.hidden {
    width: 0px !important;
    min-width: 0px !important;
  }

  .interactives-toggle {
    position: absolute;
    top: 12px;
    right: 8px;
    cursor: pointer;
    border: 0 !important;
    z-index: 2;
    background: none;
  }

  .interactives-toggle:hover,
  .interactives-toggle:focus {
    color: #1ea7fd;
  }

  .interactives-dragbar {
    content: '';
    position: absolute;
    top: 0;
    left: -10px;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }

  .interactives-body {
    padding: 0 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>