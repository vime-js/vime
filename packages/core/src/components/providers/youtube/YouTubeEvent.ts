import { YouTubePlaybackQuality } from './YouTubePlaybackQuality';

export enum YouTubeEvent {
  InitialDelivery = 'initialDelivery',
  Ready = 'onReady',
  InfoDelivery = 'infoDelivery',
  ApiInfoDelivery = 'apiInfoDelivery',
}

export interface YouTubeMessage {
  channel: string
  event: YouTubeEvent,
  info?: YouTubeMessageInfo
}

export interface YouTubeVideoData {
  author: string
  title: string
  video_id: string
}

export interface YouTubeMessageInfo {
  availablePlaybackRates?: number[]
  availableQualityLevels?: YouTubePlaybackQuality[]
  currentTime?: number
  currentTimeLastUpdated?: number
  videoLoadedFraction?: number
  volume?: number
  videoUrl?: string
  videoData?: YouTubeVideoData
  duration?: number
  muted?: boolean
  playbackQuality?: YouTubePlaybackQuality
  playbackRate?: number
  playerState?: YouTubePlayerState
}

export enum YouTubePlayerState {
  Unstarted = -1,
  Ended = 0,
  Playing = 1,
  Paused = 2,
  Buffering = 3,
  Cued = 5
}
