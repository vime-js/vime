import { Params } from '../../../utils/network';

export enum EmbedEvent {
  SrcChange = 'vEmbedSrcChange',
  Message = 'vEmbedMessage',
  Loaded = 'vEmbedLoaded'
}

export interface EmbedEventPayload {
  [EmbedEvent.SrcChange]: string,
  [EmbedEvent.Loaded]: void,
  [EmbedEvent.Message]: Params
}
