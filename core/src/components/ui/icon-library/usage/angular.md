```html {5,8,15} title="example.html"
<!-- Change the icons property to the name of the library you'd like to use. -->
<vm-player icons="material">
  <!-- ... -->
  <vm-ui>
    <!-- Register a custom icon library. -->
    <vm-icon-library name="my-library" [resolver]="customResolver"></vm-icon-library>
  </vm-ui>
</vm-player>
```

```ts title="example.ts"
class Example {
  customResolver = (iconName: string) => `/icons/${iconName}.svg`;
}
```
