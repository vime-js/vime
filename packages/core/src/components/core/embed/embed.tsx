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
import { appendParamsToURL, Params, preconnect } from '../../../utils/network';

let idCount = 0;
const connected = new Set();

@Component({
  tag: 'vime-embed',
  styleUrl: 'embed.scss',
})
export class Embed implements ComponentInterface {
  private id!: string;

  private iframe?: HTMLIFrameElement;

  @Element() el!: HTMLVimeEmbedElement;

  @State() srcWithParams = '';

  @State() hasEnteredViewport = false;

  /**
   * A URL that will load the external player and media (Eg: https://www.youtube.com/embed/DyTCOwB0DVw).
   */
  @Prop() embedSrc = '';

  /**
   * The title of the current media so it can be set on the inner `iframe` for screen readers.
   */
  @Prop() mediaTitle = '';

  /**
   * The parameters to pass to the embedded player which are appended to the `embedSrc` prop. These
   * can be passed in as a query string or object.
   */
  @Prop({ attribute: 'params' }) params: string | Params = '';

  @Watch('embedSrc')
  @Watch('params')
  srcChange() {
    this.srcWithParams = appendParamsToURL(this.embedSrc, this.params);
  }

  @Watch('srcWithParams')
  srcWithParamsChange() {
    if (!this.hasEnteredViewport && !connected.has(this.embedSrc)) {
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
  @Prop({ attribute: 'decoder' }) decoder?: (data: string) => Params | undefined;

  /**
   * Emitted when the `embedSrc` or `params` props change. The payload contains the `params`
   * serialized into a query string and appended to `embedSrc`.
   */
  @Event({ bubbles: false }) vEmbedSrcChange!: EventEmitter<string>;

  /**
   * Emitted when a new message is received from the embedded player via `postMessage`.
   */
  @Event({ bubbles: false }) vEmbedMessage!: EventEmitter<any>;

  /**
   * Emitted when the embedded player and any new media has loaded.
   */
  @Event({ bubbles: false }) vEmbedLoaded!: EventEmitter<void>;

  @Watch('preconnections')
  preconnectionsChange() {
    if (this.hasEnteredViewport) { return; }

    this.preconnections
      .filter((connection) => !connected.has(connection))
      .forEach((connection) => {
        if (preconnect(connection)) connected.add(connection);
      });
  }

  connectedCallback() {
    this.srcChange();
    this.genIframeId();
  }

  @Listen('message', { target: 'window' })
  onWindowMessage(e: MessageEvent) {
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
    this.iframe?.contentWindow?.postMessage(JSON.stringify(message), (target ?? '*'));
  }

  private onLoad() {
    this.vEmbedLoaded.emit();
  }

  private genIframeId() {
    idCount += 1;
    this.id = `vime-iframe-${idCount}`;
  }

  render() {
    return (
      <iframe
        class="lazy"
        id={this.id}
        title={this.mediaTitle}
        data-src={this.srcWithParams}
        // @ts-ignore
        allowfullscreen="1"
        allow="autoplay; encrypted-media; picture-in-picture"
        onLoad={this.onLoad.bind(this)}
        ref={(el: any) => { this.iframe = el; }}
      />
    );
  }
}
