```tsx {5-7}
class Example {
  render() {
    return (
      <vime-player controls>
        <vime-hls version="latest" poster="/media/poster.png">
          <source data-src="/media/index.m3u8" type="application/x-mpegURL" />
        </vime-hls>
        {/* ... */}
      </vime-player>
    );
  }
}
```