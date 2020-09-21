```tsx {5-8}
class Example {
  render() {
    return (
      <vime-player controls>
        <vime-audio>
          <source data-src="/media/audio.mp3" type="audio/mp3" />
          {/* <source> and <track> elements are placed here. */}
        </vime-audio>
        {/* ... */}
      </vime-player>
    );
  }
}
```