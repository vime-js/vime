<ul class="uk-list uk-list-divider">
  {#each props.filter(p => p.readonly) as prop (prop.id)}
    <li>
      <span class="uk-text-emphasis uk-text-small">{prop.id}</span> 
      <pre><code>{JSON.stringify(prop.value)}</code></pre>
    </li>
  {/each}
</ul>

<script>
  export let props = [];
</script>