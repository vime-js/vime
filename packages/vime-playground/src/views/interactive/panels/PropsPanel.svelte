<form class="uk-form-stacked" onsubmit="return false;">
  {#each props as prop (prop.id)}
    <div class="uk-margin" data-uk-scrollspy>
      <code>{prop.label || prop.id}</code>
      <div class="uk-form-controls uk-margin-small-top">
        {#if prop.readonly}
          <pre class="disabled">{JSON.stringify(prop.value, undefined, 2)}</pre>
        {:else if prop.type === 'json'}
          <textarea
            id={prop.id} 
            class="uk-textarea"
            on:change={onJsonChange}
            value={JSON.stringify(prop.value, undefined, 2)}
          />
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
    <hr />
  {/each}
</form>

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let props = [];

  const onChange = (e) => {
    const { target } = e;
    const { type } = target;
    let value;
    switch (type) {
      case 'checkbox':
        value = target.checked;
        break;
      case 'number':
        value = parseInt(target.value, 10);
        break;
      default:
        value = target.value;
    }
    dispatch('propschange', { prop: e.target.id, value });
  };

  const onJsonChange = (e) => {
    try {
      const value = JSON.parse(e.target.value);
      dispatch('propschange', { prop: e.target.id, value });
    } catch (_) { /** noop */ }
  };
</script>

<style>
  .uk-form-controls {
    position: relative;
  }

  .disabled {
    background-color: #f8f8f8;
    color: #999;
    border-color: #e5e5e5;
  }

  textarea {
    min-width: 100%;
    min-height: 150px;
  }
</style>