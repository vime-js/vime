<form class="uk-form-stacked" onsubmit="return false;">
  {#each props.filter(p => !p.readonly) as prop (prop.id)}
    <div class="uk-margin">
      <label class="uk-form-label" for="{prop.id}">{prop.label || prop.id}</label>
      <div class="uk-form-controls">
        {#if prop.type === 'boolean'}
          <input 
            id={prop.id} 
            class="uk-checkbox" 
            type="checkbox"
            on:change
            placeholder={prop.placeholder || prop.id}
            bind:checked={prop.value}
          />
        {:else if prop.type === 'select'}
          <select
            id={prop.id}
            class="uk-select" 
            on:change
            bind:value={prop.value}
          >
            {#each prop.options as option}
              <option value={option.value}>option.title</option>
            {/each}
          </select>
        {:else if prop.type === 'number'}
          <input 
            id={prop.id} 
            class="uk-input"  
            type="number"
            on:change
            placeholder={prop.placeholder || prop.id} 
            bind:value={prop.value}
          />
        {:else}
          <input 
            id={prop.id} 
            class="uk-input" 
            type="text"
            on:change
            placeholder={prop.placeholder || prop.id} 
            bind:value={prop.value}
          />
        {/if}
      </div>
    </div>
  {/each}
</form>

<script>
  export let props = [];
</script>