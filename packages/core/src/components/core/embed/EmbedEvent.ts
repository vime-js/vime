export enum EmbedEvent {
  SrcChange = 'embedSrcChange',
  Message = 'embedMessage',
  Loaded = 'embedLoaded'
}

export interface EmbedEventPayload {
  [EmbedEvent.SrcChange]: string,
  [EmbedEvent.Loaded]: void,
  [EmbedEvent.Message]: any
}
