import { VimeoCommand } from './VimeoCommands';
import { VimeoDataEvent } from './VimeoEvent';

export interface VimeoMessage {
  data?: any
  value?: any
  method?: VimeoCommand
  event?: VimeoDataEvent
}
