```html title="example.html"
<vime-slider
  step="5"
  max="100"
  label="Volume"
  [value]="value"
  (vValueChange)="onValueChange($event)"
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
