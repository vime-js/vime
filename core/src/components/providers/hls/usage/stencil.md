```tsx {5-7}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-hls version="latest" poster="/media/poster.png">
          <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
        </vm-hls>
        {/* ... */}
      </vm-player>
    );
  }
}
```