export interface CaptionsAdapter {
  setCurrentTextTrack?(trackId: number): Promise<void>;
  setTextTrackVisibility?(isVisible: boolean): Promise<void>;
}
