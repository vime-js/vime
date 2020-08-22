```html {5-11} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-menu
      identifer="menu-id"
      controller="menu-controller-id"
      [active]="isMenuActive"
    >
      <!-- ... -->
    </vime-menu>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
class Example {
  isMenuActive = false;

  // ...
}
```
