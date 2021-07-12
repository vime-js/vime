export interface FullscreenAdapter {
  canSetFullscreen?(): Promise<boolean>;
  enterFullscreen?(options?: FullscreenOptions): Promise<void>;
  exitFullscreen?(): Promise<void>;
}
