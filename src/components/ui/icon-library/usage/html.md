```html {5,8,14-15}
<!-- Change the icons property to the name of the library you'd like to use. -->
<vm-player icons="material">
  <!-- ... -->
  <vm-ui>
    <!-- Register a custom icon library. -->
    <vm-icon-library name="my-library"></vm-icon-library>
  </vm-ui>
</vm-player>

<script>
  const library = document.querySelector('vm-icon-library[name="my-library"]');
  library.resolver = iconName => `/icons/${iconName}.svg`;
</script>
```
