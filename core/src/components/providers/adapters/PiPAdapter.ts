export interface PiPAdapter {
  canSetPiP?(): Promise<boolean>;
  enterPiP?(): Promise<void>;
  exitPiP?(): Promise<void>;
}
