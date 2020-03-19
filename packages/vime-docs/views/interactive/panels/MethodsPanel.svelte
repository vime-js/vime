<ul class="uk-list uk-list-divider">
  {#each methods as method (method.id)}
    <li data-uk-scrollspy>
      <span class="uk-text-emphasis uk-text-small">{method.id}</span> 
      <pre><code>{JSON.stringify(method.value)}</code></pre>
    </li>
  {/each}
</ul>

<script>
  export let methods = [];
</script>