export const enum YouTubePlaybackQuality {
  Unknown = 'unknown',
  Tiny = 'tiny',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  Hd720 = 'hd720',
  Hd1080 = 'hd1080',
  Highres = 'highres',
  Max = 'max',
}

export const mapYouTubePlaybackQuality = (quality: YouTubePlaybackQuality) => {
  switch (quality) {
    case YouTubePlaybackQuality.Unknown:
      return undefined;
    case YouTubePlaybackQuality.Tiny:
      return '144p';
    case YouTubePlaybackQuality.Small:
      return '240p';
    case YouTubePlaybackQuality.Medium:
      return '360p';
    case YouTubePlaybackQuality.Large:
      return '480p';
    case YouTubePlaybackQuality.Hd720:
      return '720p';
    case YouTubePlaybackQuality.Hd1080:
      return '1080p';
    case YouTubePlaybackQuality.Highres:
      return '1440p';
    case YouTubePlaybackQuality.Max:
      return '2160p';
    default:
      return undefined;
  }
};
