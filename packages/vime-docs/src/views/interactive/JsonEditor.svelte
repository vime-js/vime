<div bind:this={container}></div>

<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import JsonEditor from 'jsoneditor/dist/jsoneditor.min';

  require('ace-builds/src-noconflict/theme-github.js');

  const dispatch = createEventDispatcher();

  let editor;
  let container;

  export let id;
  export let value;

  const onUpdate = () => { editor.set(value); };

  const onChange = (json) => {
    try {
      const newValue = JSON.parse(json);
      value = newValue;
      dispatch('change', { id, value: newValue });
    } catch (e) { /** noop */ }
  };

  onMount(() => {
    editor = new JsonEditor(container, {
      mode: 'code',
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
      onChangeText: onChange,
    });

    editor.aceEditor.container.style.height = '150px';
    editor.aceEditor.setTheme('ace/theme/github');
    editor.aceEditor.setOption('showLineNumbers', false);
  });

  onDestroy(() => {
    editor.destroy();
    editor = null;
  });

  $: if (editor) onUpdate(value);
</script>

<style>
  div {
    width: 100%;
    height: 150px;
  }
</style>

