```html {2-17} title="example.html"
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
      src="/media/caps/fr.vtt"
      srclang="fr"
      label="French"
    />
  </vm-video>
  <!-- ... -->
</vm-player>
```
