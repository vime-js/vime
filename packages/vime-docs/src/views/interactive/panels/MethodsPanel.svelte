<ul class="uk-list">
  {#each methods as method (method.id)}
    <li data-uk-scrollspy>
      <code>{method.id}</code>
      <pre><code>{JSON.stringify(method.value, undefined, 2)}</code></pre>
    </li>
    <hr />
  {/each}
</ul>

<script>
  export let methods = [];
</script>