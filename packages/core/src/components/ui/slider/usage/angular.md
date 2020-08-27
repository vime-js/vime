```html title="example.html"
<vime-slider
  label="Volume"
  [step]="5"
  [max]="100"
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
