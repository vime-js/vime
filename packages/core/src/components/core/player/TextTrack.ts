export interface TextTrackCue {
  startTime: number
  endTime: number
  text: string
  isActive: boolean
  textTrack: TextTrack
}

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

// @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track
// @see https://developer.mozilla.org/en-US/docs/Web/API/TextTrack
export interface TextTrack {
  src: string
  label: string
  language: string
  default: boolean
  cues: TextTrackCue[]
  activeCues: TextTrackCue[]
  kind: TextTrackKind
  mode: TextTrackMode
}
