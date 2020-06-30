import { Params } from '../../utils/network';

export enum EmbedEvent {
  SrcChange = 'vimeEmbedSrcChange',
  Message = 'vimeEmbedMessage',
  Loaded = 'vimeEmbedLoaded'
}

export interface EmbedEventPayload {
  [EmbedEvent.SrcChange]: string,
  [EmbedEvent.Loaded]: void,
  [EmbedEvent.Message]: Params
}
