<form class="uk-form-stacked" onsubmit="return false;">
  {#each props as prop}
    <div class="uk-margin" data-uk-scrollspy>
      <label class="uk-form-label" for="{prop.id}">{prop.label || prop.id}</label>
      <div class="uk-form-controls">
        {#if prop.readonly}
          <pre class="disabled">{JSON.stringify(prop.value, undefined, 2)}</pre>
        {:else if prop.type === 'editor'}
          <div bind:this={editorContainers[prop.id]}></div>
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
  import JSONEditor from 'jsoneditor/dist/jsoneditor.min';

  const editors = {};
  const editorContainers = {};
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

  const onMountEditors = () => Object.keys(editorContainers)
    .filter(id => !Object.keys(editors).includes(id))
    .forEach(id => {
      const container = editorContainers[id];

      container.style.width = '100%';
      container.style.height = '200px';

      const editor = new JSONEditor(container, {
        mode: 'code',
        mainMenuBar: false,
        navigationBar: false,
        statusBar: false,
        maxLines: 10000,
        onChangeText: json => {
          try {
            const obj = JSON.parse(json);
            // dispatch('propschange', obj);
            console.log(obj);
          } catch (e) { /** noop */ }
        }
      });

      editor.aceEditor.container.style.height = '200px';
      editor.aceEditor.setTheme('ace/theme/chrome');
      // editor.aceEditor.renderer.setShowGutter(false);

      editor.set({
        Array: [1, 2, 3],
        Boolean: true,
        Null: null,
        Number: 123,
        Object: {a: "b", c: "d"},
        String: "Hello World"
      });
    });

  const onDestroyEditors = () => Object.keys(editors)
    .filter(id => !Object.keys(editorContainers).includes(id))
    .forEach(id => {
      editors[id].destroy();
      delete editors[id];
    });

  $: onMountEditors(editorContainers);
  $: onDestroyEditors(editorContainers);
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
</style>