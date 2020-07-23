/**
 * @see https://developer.dailymotion.com/player/#player-api-methods
 */
export enum DailymotionCommand {
  Play = 'play',
  Pause = 'pause',
  Seek = 'seek',
  Volume = 'volume',
  Controls = 'controls',
  Muted = 'muted',
  Quality = 'quality',
  Fullscreen = 'fullscreen',
}

export interface DailymotionCommandArg {
  [DailymotionCommand.Play]: void
  [DailymotionCommand.Pause]: void
  [DailymotionCommand.Seek]: number
  [DailymotionCommand.Volume]: number
  [DailymotionCommand.Controls]: boolean
  [DailymotionCommand.Muted]: boolean
  [DailymotionCommand.Quality]: string
  [DailymotionCommand.Fullscreen]: boolean
}
