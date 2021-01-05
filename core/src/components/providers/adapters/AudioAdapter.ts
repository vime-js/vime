export interface AudioAdapter {
  setCurrentAudioTrack?(trackId: number): Promise<void>;
}
