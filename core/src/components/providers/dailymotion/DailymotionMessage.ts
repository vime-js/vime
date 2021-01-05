import { DailymotionEvent } from './DailymotionEvent';

export interface DailymotionMessage {
  time?: string;
  volume?: string;
  muted?: string;
  duration?: string;
  qualities?: string[];
  quality?: string;
  title?: string;
  fullscreen?: string;
  error?: string;
  event?: DailymotionEvent;
}
