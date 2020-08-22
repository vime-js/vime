```html {2-18} title="example.html"
<vime-player controls>
  <vime-video poster="/media/poster.png">
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
    <!-- ... -->
  </vime-video>
  <!-- ... -->
</vime-player>
```
