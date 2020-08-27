```html {5-13} title="example.html"
<vime-player>
  <!-- ... -->
  <vime-ui>
    <!-- ... -->
    <vime-menu
      identifer="menu-id"
      controller="menu-controller-id"
      [active]="isMenuActive"
      (vOpen)="onOpen()"
      (vClose)="onClose()"
    >
      <!-- ... -->
    </vime-menu>
  </vime-ui>
</vime-player>
```

```ts title="example.ts"
class Example {
  isMenuActive = false;

  onOpen() {
    this.isMenuActive = true;
  }

  onClose() {
    this.isMenuActive = false;
  }
}
```
