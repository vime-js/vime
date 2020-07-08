export enum YouTubeCommand {
  Play = 'playVideo',
  Pause = 'pauseVideo',
  Seek = 'seekTo',
  Mute = 'mute',
  Unmute = 'unMute',
  SetVolume = 'setVolume',
  SetPlaybackRate = 'setPlaybackRate'
}

export interface YouTubeCommands {
  [YouTubeCommand.Play]: void;
  [YouTubeCommand.Pause]: void;
  [YouTubeCommand.Seek]: number;
  [YouTubeCommand.Mute]: void;
  [YouTubeCommand.Unmute]: void;
  [YouTubeCommand.SetVolume]: number;
  [YouTubeCommand.SetPlaybackRate]: number;
}
