<svelte:window 
  on:mouseup={stopDragging} 
  on:mousemove={onDragging} 
/>

<div 
  class="interactives"
  bind:this={el}
>
  <div 
    class="dragBar" 
    on:mousedown|preventDefault={startDragging}
  ></div>
  
  <ul uk-tab>
    <li></li>
    {#each TABS as tab, i}
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

  <ul class="uk-switcher uk-margin body">
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
          This component has no methods.
        </span>
      {/if}
    </li>
    <li>
      {#if isStorePanelActive && storeChanges.length > 0}
        <EventsPanel events={filteredStoreChanges} />
      {:else if isStorePanelActive}
        <span class="uk-text-small uk-text-muted">
          This component has no store.
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

<script>
  import PropsPanel from './panels/PropsPanel.svelte';
  import MethodsPanel from './panels/MethodsPanel.svelte';
  import EventsPanel from './panels/EventsPanel.svelte';
  import fuzzy from 'fuzzy';

  export let props = [];
  export let events = [];
  export let storeChanges = [];

  let el;
  let startX;
  let startWidth;
  let search;
  let dragging = false;
  let currentTabIndex = 0;
  let filteredEvents = [];
  let filteredProps = [];
  let filteredMethods = [];
  let filteredStoreChanges = [];

  const TABS = [
    'Props',
    'Methods',
    'Store',
    'Events',
  ];

  const startDragging = (e) => {
    dragging = true;
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(el).width, 10);
  };
  
  const stopDragging = () => { dragging = false; };

  const onDraggingHandler = (e) => {
    el.style.width = `${(startWidth - (e.clientX - startX))}px`;
  };

  const onTabChange = (index) => { currentTabIndex = index; };

  const fuzzyFilter = (list, extract) => (
    search ? fuzzy.filter(search, list, { extract }).map((f) => f.original) : list
  );

  $: onDragging = dragging ? onDraggingHandler : null;

  $: isPropsPanelActive = (currentTabIndex === 0);
  $: isMethodsPanelActive = (currentTabIndex === 1);
  $: isStorePanelActive = (currentTabIndex === 2);
  $: isEventsPanelActive = (currentTabIndex === 3);

  $: methods = props.filter((p) => p.method);
  $: pureProps = props.filter((p) => !p.method);

  $: if (isPropsPanelActive) filteredProps = fuzzyFilter(pureProps, (p) => p.id, search);
  $: if (isMethodsPanelActive) filteredMethods = fuzzyFilter(methods, (p) => p.id, search);
  $: if (isEventsPanelActive) filteredEvents = fuzzyFilter(events, (e) => e.event, search);
  $: if (isStorePanelActive) filteredStoreChanges = fuzzyFilter(storeChanges, (e) => e.event, search);
</script>

<style>
  .interactives {
    width: 0;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    position: relative;
    max-width: 60%;
    overflow-y: auto;
    background-color: #fff;
  }

  @media (min-width: 800px) {
    .interactives {
      width: 350px;
      min-width: 350px;
    }
  }

  .interactives :global(input:focus) {
    border: 1px solid #1ea7fd;
  }

  .interactives :global(.uk-tab > .uk-active > a) {
    color: #1ea7fd;
    border-color: #22aaff; 
  }

  .interactives :global(.uk-checkbox:checked) {
    background-color: #1ea7fd;
  }

  .search {
    padding: 0 20px;
    margin-bottom: 20px;
    background-color: #fff;
  }

  .dragBar {
    content: '';
    position: absolute;
    top: 0;
    left: -8px;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }

  .body {
    padding: 0 20px;
    overflow: auto;
    margin-top: 0 !important;
  }
</style>