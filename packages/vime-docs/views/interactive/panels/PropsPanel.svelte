<form class="uk-form-stacked" onsubmit="return false;">
  {#each props as prop}
    <div class="uk-margin" data-uk-scrollspy>
      <label class="uk-form-label" for="{prop.id}">{prop.label || prop.id}</label>
      <div class="uk-form-controls">
        {#if prop.readonly}
          <pre class="disabled">{JSON.stringify(prop.value, undefined, 2)}</pre>
        {:else if prop.type === 'boolean'}
          <input 
            id={prop.id} 
            class="uk-checkbox" 
            type="checkbox"
            on:change={onChange}
            disabled={prop.readonly}
            bind:checked={prop.value}
          />
        {:else if prop.type === 'select'}
          <select
            id={prop.id}
            class="uk-select" 
            on:change={onChange}
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
            on:change={onChange}
            bind:value={prop.value}
          />
        {:else}
          <input 
            id={prop.id} 
            class="uk-input" 
            type="text"
            on:change={onChange}
            bind:value={prop.value}
          />
        {/if}
      </div>
    </div>
  {/each}
</form>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let props = [];

  const onChange = e => {
    const target = e.target;
    const type = target.type;
    let value;
    switch (type) {
      case 'checkbox':
        value = target.checked;
        break;
      case 'number':
        value = parseInt(target.value);
        break;
      default:
        value = target.value;
    }
    dispatch('propschange', { prop: e.target.id, value });
  };
</script>

<style>
  .disabled {
    background-color: #f8f8f8;
    color: #999;
    border-color: #e5e5e5;
  }
</style>