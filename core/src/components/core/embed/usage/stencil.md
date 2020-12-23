```tsx
class Example {
  private onMessage(event: CustomEvent<any>) {
    const message = event.detail;
    // ...
  }

  render() {
    return (
      <vm-embed
        embedSrc="https://www.youtube-nocookie.com/embed/DyTCOwB0DVw"
        params={{ autoplay: 1, muted: 1, controls: 0 }}
        mediaTitle="Agent 327: Operation Barbershop"
        origin="https://www.youtube-nocookie.com"
        onVmEmbedMessage={this.onMessage.bind(this)}
      />
    );
  }
}
```