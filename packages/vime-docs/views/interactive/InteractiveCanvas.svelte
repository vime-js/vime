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
  <button
    class="uk-icon-button interactives-toggle"
    on:click={onToggle}
  >
    <span uk-icon="icon: move;"></span>
  </button>
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
    <ul class="interactives-tabs" uk-tab>
      <li></li>
      {#each tabs as tab, i}
        <li><a href={`#${tab}`} on:click="{() => onTabChange(i)}">{tab}</a></li>
      {/each}
    </ul>
    <div class="search">
      <form 
        class="uk-width-1-1 uk-search uk-search-default"
        onsubmit="return false;"
      >
        <span uk-search-icon></span>
        <input 
          class="uk-search-input" 
          type="search"
          placeholder="Search..."
          bind:value={search}
        />
      </form>
    </div>
    <ul class="uk-switcher uk-margin interactives-body">
      <li>
        {#if isPropsPanelActive && pureProps.length > 0}
          <PropsPanel props={filteredProps} on:propschange />
        {:else if isPropsPanelActive}
          <span class="uk-text-small uk-text-muted">
            This component has no props.
          </span>
        {/if}
      </li>
      <li>
        {#if isMethodsPanelActive && methods.length > 0}
          <MethodsPanel methods={filteredMethods} />
        {:else if isMethodsPanelActive}
          <span class="uk-text-small uk-text-muted">
            This component has no getter methods.
          </span>
        {/if}
      </li>
      <li>
        {#if isEventsPanelActive && events.length > 0}
          <EventsPanel events={filteredEvents} />
        {:else if isEventsPanelActive}
          <span class="uk-text-small uk-text-muted">
            This component has not fired any events.
          </span>
        {/if}
      </li>
    </ul>
  </div>
</div>

<script>
  import { onMount, onDestroy } from 'svelte';
  import { raf } from 'svelte/internal';
  import fuzzy from 'fuzzy';
  import Center from '../../components/Center.svelte';
  import PropsPanel from './panels/PropsPanel.svelte';
  import MethodsPanel from './panels/MethodsPanel.svelte';
  import EventsPanel from './panels/EventsPanel.svelte';

  let startX;
  let startWidth;
  let canvasEl;
  let search;
  let interactivesEl;
  let hidden = false;
  let dragging = false;
  let currentTabIndex = 0;
  let transitioning = false;
  let filteredEvents = [];
  let filteredProps = [];
  let filteredMethods = [];

  const tabs = [
    'Props',
    'Methods',
    'Events'
  ];

  export let props = [];
  export let events = [];

  onMount(() => {
    const width = parseFloat(window.getComputedStyle(canvasEl).width);
    if (width < 760) hidden = true;
  });

  onDestroy(() => {
    filteredEvents = [];
    filteredProps = [];
    filteredMethods = [];
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
  
  const stopDragging = e => { dragging = false; };

  const onDraggingHandler = e => {
    interactivesEl.style.width = `${(startWidth - (e.clientX - startX))}px`;
  };

  const onTabChange = index => { currentTabIndex = index; };

  const fuzzyFilter = (list, extract) => search 
    ? fuzzy.filter(search, list, { extract }).map(f => f.original) 
    : list;

  $: onDragging = dragging ? onDraggingHandler : null;

  $: isPropsPanelActive = (currentTabIndex === 0);
  $: isMethodsPanelActive = (currentTabIndex === 1);
  $: isEventsPanelActive = (currentTabIndex === 2);

  $: methods = props.filter(p => p.method);
  $: pureProps = props.filter(p => !p.method);

  $: if (isPropsPanelActive) filteredProps = fuzzyFilter(pureProps, p => p.id, search);
  $: if (isMethodsPanelActive) filteredMethods = fuzzyFilter(methods, p => p.id, search);
  $: if (isEventsPanelActive) filteredEvents = fuzzyFilter(events, e => e.event, search);
</script>

<style>
  .canvas {
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

  .search {
    z-index: 2;
    padding: 0 20px;
    margin-bottom: 20px;
    background-color: #fff;
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
    overflow-y: auto;
  }

  @media (min-width: 959px) {
    .interactives {
      width: 350px;
    }
  }

  .interactives-tabs {
    z-index: 2;
    background-color: #fff;
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
    right: 16px;
    cursor: pointer;
    border: 0 !important;
    z-index: 3;
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
    left: -8px;
    width: 10px;
    height: 100%;
    z-index: 3;
    cursor: col-resize;
  }

  .interactives-body {
    padding: 0 20px;
    overflow: auto;
    margin-top: 0 !important;
  }
</style>