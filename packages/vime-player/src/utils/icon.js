export const get_playback_icon = (icons, isPaused) => isPaused ? icons.play : icons.pause

export const get_captions_icon = (icons, isActive) => isActive
  ? icons.captionsOn
  : icons.captionsOff

export const get_fullscreen_icon = (icons, isActive) => isActive
  ? icons.exitFullscreen
  : icons.enterFullscreen

export const get_pip_icon = (icons, isActive) => isActive ? icons.exitPiP : icons.enterPiP

export const get_volume_icon = (icons, isMuted, volume) => {
  const volumeIcon = (volume < 50) ? icons.volumeLow : icons.volumeHigh
  return (isMuted || (volume === 0)) ? icons.volumeMute : volumeIcon
}
