<div class="uk-width-1-1 uk-flex uk-flex-center">
  <button 
    class="uk-button uk-button-danger uk-margin-small-top" 
    uk-toggle="target: #interactive-canvas" 
    type="button"
  >
    Show Interactives
  </button>
</div>

<div id="interactive-canvas" uk-offcanvas="flip: true">
  <div class="uk-offcanvas-bar">
    <button class="uk-offcanvas-close" type="button" uk-close></button>
    <ul uk-tab>
      <li><a href="#">Props</a></li>
      <li><a href="#">Events</a></li>
    </ul>
    <ul class="uk-switcher uk-margin">
      <li>
        <PropsPanel
          {props} 
          on:change
        />
      </li>
      <li>
        <EventsPanel 
          {events} 
        />
      </li>
    </ul>
  </div>
</div>

<script>
  import PropsPanel from './panels/PropsPanel.svelte';
  import EventsPanel from './panels/EventsPanel.svelte';

  export let props = [];
  export let events = {};
</script>