// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
export enum TextTrackKind {
  Captions = 'captions',
  Chapters = 'chapters',
  Descriptions = 'descriptions',
  Metadata = 'metadata',
  Subtitles = 'subtitles',
}

// @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrack/mode
export enum TextTrackMode {
  Disabled = 'disabled',
  Showing = 'showing',
  Hidden = 'hidden'
}
