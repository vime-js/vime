```html
<vm-slider step="5" max="100" value="50" label="Volume" />

<script>
  const slider = document.querySelector('vm-slider');

  slider.addEventListener('vmValueChange', (event) => {
    const newValue = event.detail;
  });
</script>
```
