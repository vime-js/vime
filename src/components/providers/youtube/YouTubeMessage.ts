import { YouTubeEvent } from './YouTubeEvent';
import { YouTubePlaybackQuality } from './YouTubePlaybackQuality';
import { YouTubePlayerState } from './YouTubePlayerState';

export interface YouTubeVideoData {
  author: string;
  title: string;
  video_id: string;
}

export interface YouTubeMessageInfo {
  availablePlaybackRates?: number[];
  availableQualityLevels?: YouTubePlaybackQuality[];
  currentTime?: number;
  currentTimeLastUpdated?: number;
  videoLoadedFraction?: number;
  volume?: number;
  videoUrl?: string;
  videoData?: YouTubeVideoData;
  duration?: number;
  muted?: boolean;
  playbackQuality?: YouTubePlaybackQuality;
  playbackRate?: number;
  playerState?: YouTubePlayerState;
}

export interface YouTubeMessage {
  channel: string;
  event: YouTubeEvent;
  info?: YouTubeMessageInfo;
}
