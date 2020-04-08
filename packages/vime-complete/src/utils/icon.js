export const get_playback_icon = (icons, paused) => (paused ? icons.play : icons.pause);

export const get_captions_icon = (icons, active) => (active
  ? icons.captionsOn
  : icons.captionsOff);

export const get_fullscreen_icon = (icons, active) => (active
  ? icons.exitFullscreen
  : icons.enterFullscreen);

export const get_pip_icon = (icons, active) => (active ? icons.exitPiP : icons.enterPiP);

export const get_volume_icon = (icons, muted, volume) => {
  const volumeIcon = (volume < 50) ? icons.volumeLow : icons.volumeHigh;
  return (muted || (volume === 0)) ? icons.volumeMute : volumeIcon;
};
