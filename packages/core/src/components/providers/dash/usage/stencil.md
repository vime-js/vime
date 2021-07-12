```tsx {5-9}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-dash
          src="/media/manifest.mpd"
          version="latest"
          poster="/media/poster.png"
        />
        {/* ... */}
      </vm-player>
    );
  }
}
```
