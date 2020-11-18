```tsx {5-8}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-audio>
          <source data-src="/media/audio.mp3" type="audio/mp3" />
          {/* <source> and <track> elements are placed here. */}
        </vm-audio>
        {/* ... */}
      </vm-player>
    );
  }
}
```