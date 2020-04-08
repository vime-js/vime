<ul class="uk-list">
  {#each methods as method (method.id)}
    {#if !method.setter}
      <li data-uk-scrollspy>
        <code>{method.id}</code>
        <pre><code>{JSON.stringify(method.value, undefined, 2)}</code></pre>
      </li>
    {:else}
      <li data-uk-scrollspy>
        <code>{method.id}</code>
        <pre><code>Callable</code></pre>
      </li>
    {/if}
    <hr />
  {/each}
</ul>

<script>
  export let methods = [];
</script>