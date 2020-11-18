```html title="example.html"
<vm-slider
  label="Volume"
  [step]="5"
  [max]="100"
  [value]="value"
  (vmValueChange)="onValueChange($event)"
/>
```

```ts title="example.ts"
class Example {
  value = 50;

  onValueChange(event: CustomEvent<number>) {
    this.value = event.detail;
  }
}
```
