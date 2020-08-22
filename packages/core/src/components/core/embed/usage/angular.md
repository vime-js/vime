```html title="example.html"
<vime-embed
  embed-src="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
  media-title="Agent 327: Operation Barbershop"
  origin="https://www.youtube-nocookie.com"
  [params]="params"
  (vEmbedMessage)="onMessage($event)"
/>
```

```ts title="example.ts"
class Example {
  params = {
    autoplay: 1,
    muted: 1,
    controls: 0,
  };

  onMessage(event: CustomEvent<any>) {
    const message = event.detail;
    // ...
  }
}
```
