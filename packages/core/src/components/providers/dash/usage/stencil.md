```tsx {5-9}
class Example {
  render() {
    return (
      <vime-player controls>
        <vime-dash
          src="/media/manifest.mpd"
          version="latest"
          poster="/media/poster.png"
        />
        {/* ... */}
      </vime-player>
    );
  }
}
```