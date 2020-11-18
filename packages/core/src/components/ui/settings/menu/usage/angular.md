```html {5-13} title="example.html"
<vm-player>
  <!-- ... -->
  <vm-ui>
    <!-- ... -->
    <vm-menu
      identifer="menu-id"
      controller="menu-controller-id"
      [active]="isMenuActive"
      (vmOpen)="onOpen()"
      (vmClose)="onClose()"
    >
      <!-- ... -->
    </vm-menu>
  </vm-ui>
</vm-player>
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
