import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { isString } from '../../../utils/unit';
import { EmbedEvent, EmbedEventPayload } from './EmbedEvent';
import { appendParamsToURL, Params, preconnect } from '../../../utils/network';
import { onElementEntersViewport } from '../../../utils/dom';

let embedIdCount = 0;
const connected = new Set();

@Component({
  tag: 'vime-embed',
  styleUrl: 'embed.scss',
})
export class Embed implements ComponentInterface {
  private intersectionObserverCleanup?: (() => void);

  @Element() el!: HTMLVimeEmbedElement;

  @State() srcWithParams = '';

  @State() inViewport = false;

  /**
   * A URL that will load the external player and media (Eg: https://www.youtube.com/embed/DyTCOwB0DVw).
   */
  @Prop() embedSrc = '';

  /**
   * The title of the current media so it can be set on the inner `iframe` for screen readers.
   */
  @Prop() mediaTitle = '';

  /**
   * The parameters to pass to the embedded player. These are encoded as a query string and
   * appended to the `embedSrc` prop.
   */
  @Prop({ attribute: 'params' }) params: Params = {};

  @Watch('embedSrc')
  @Watch('params')
  srcChangeHandler() {
    this.srcWithParams = appendParamsToURL(this.embedSrc, this.params);
  }

  @Watch('srcWithParams')
  srcWithParamsChangeHandler() {
    if (!this.inViewport && !connected.has(this.embedSrc)) {
      if (preconnect(this.srcWithParams)) connected.add(this.embedSrc);
    }

    this.vEmbedSrcChange.emit(this.srcWithParams);
  }

  /**
   * Where the src request had originated from without any path information.
   */
  @Prop() origin?: string;

  /**
   * A collection of URLs to that the browser should immediately start establishing a connection
   * with.
   */
  @Prop({ attribute: 'preconnections' }) preconnections: string[] = [];

  /**
   * A function which accepts the raw message received from the embedded media player via
   * `postMessage` and converts it into a POJO.
   */
  @Prop({ attribute: 'decoder' }) decoder?: (data: string) => Params;

  /**
   * Emitted when the `embedSrc` or `params` props change. The payload contains the `params`
   * serialized into a query string and appended to `embedSrc`.
   */
  @Event({
    bubbles: false,
  }) vEmbedSrcChange!: EventEmitter<EmbedEventPayload[EmbedEvent.SrcChange]>;

  /**
   * Emitted when a new message is received from the embedded player via `postMessage`.
   */
  @Event({
    bubbles: false,
  }) vEmbedMessage!: EventEmitter<EmbedEventPayload[EmbedEvent.Message]>;

  /**
   * Emitted when the embedded player and any new media has loaded.
   */
  @Event({
    bubbles: false,
  }) vEmbedLoaded!: EventEmitter<EmbedEventPayload[EmbedEvent.Loaded]>;

  @Watch('preconnections')
  preconnectionsChangeHandler() {
    if (this.inViewport) { return; }

    this.preconnections
      .filter((connection) => !connected.has(connection))
      .forEach((connection) => {
        if (preconnect(connection)) connected.add(connection);
      });
  }

  componentWillLoad() {
    this.intersectionObserverCleanup = onElementEntersViewport(
      this.el,
      () => { this.inViewport = true; },
    );

    this.srcChangeHandler();
  }

  disconnectedCallback() {
    this.intersectionObserverCleanup?.();
  }

  @Listen('message', { target: 'window' })
  onMessage(e: MessageEvent) {
    const originMatches = (e.source === this.iframe?.contentWindow)
      && (!isString(this.origin) || this.origin === e.origin);

    if (!originMatches) return;

    const message = this.decoder?.(e.data) ?? e.data;
    if (message) this.vEmbedMessage.emit(message);
  }

  /**
   * Posts a message to the embedded media player.
   */
  @Method()
  async postMessage(message: any, target?: string) {
    this.iframe?.contentWindow?.postMessage(JSON.stringify(message), (target ?? origin) ?? '*');
  }

  get iframe() {
    return this.el.querySelector<HTMLIFrameElement>('iframe');
  }

  private onLoad() {
    this.vEmbedLoaded.emit();
  }

  private getEmbedId() {
    const id = this.iframe?.id;
    if (isString(id)) return id;
    embedIdCount += 1;
    return `vime-embed-${embedIdCount}`;
  }

  render() {
    return (
      <iframe
        id={this.getEmbedId()}
        title={this.mediaTitle}
        src={this.inViewport ? this.srcWithParams : ''}
        // @ts-ignore
        allowFullScreen="1"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        onLoad={this.onLoad.bind(this)}
      />
    );
  }
}
