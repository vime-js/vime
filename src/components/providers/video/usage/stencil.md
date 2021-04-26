```tsx {5-20}
class Example {
  render() {
    return (
      <vm-player controls>
        <vm-video poster="/media/poster.png">
          <source data-src="/media/video.mp4" type="video/mp4" />
          <track
            default
            kind="subtitles"
            src="/media/subs/en.vtt"
            srclang="en"
            label="English"
          />
          <track
            kind="captions"
            src="/media/caps/es.vtt"
            srclang="es"
            label="Spanish"
          />
        </vm-video>
        {/* ... */}
      </vm-player>
    );
  }
}
```
