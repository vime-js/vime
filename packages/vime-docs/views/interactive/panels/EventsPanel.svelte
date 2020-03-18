<ul class="uk-list">
  {#each Object.keys(events) as event}
    <li>
      <b>{event}</b>
      <br/>
      <pre><code>{JSON.stringify(events[event])}</code></pre>
    </li>
  {/each}
</ul>

<script>
  export let events = [];
</script>