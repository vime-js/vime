```html
<vime-slider step="5" max="100" value="50" label="Volume" />

<script>
  const slider = document.querySelector('vime-slider');

  slider.addEventListener('vValueChange', (event) => {
    const newValue = event.detail;
  });
</script>
```
