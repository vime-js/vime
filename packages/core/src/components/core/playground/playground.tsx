/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  h, Fragment, Component, Prop,
} from '@stencil/core';
import { Provider } from '../../providers/Provider';

const BASE_MEDIA_URL = 'https://media.vimejs.com';

@Component({
  tag: 'vm-playground',
  styleUrl: 'playground.css',
  scoped: true,
})
export class Playground {
  private player?: HTMLVmPlayerElement;

  /**
   * The current media provider.
   */
  @Prop({ mutable: true }) provider: Provider = Provider.Audio;

  /**
   * The current `src` to load into the provider.
   */
  @Prop({ mutable: true }) src?: string;

  /**
   * Whether to show the custom Vime UI or not.
   */
  @Prop({ mutable: true }) showCustomUI = false;

  /**
   * Whether to show the native controls or not.
   */
  @Prop({ mutable: true }) showControls = true;

  /**
   * The current custom UI theme, won't work if custom UI is turned off.
   */
  @Prop({ mutable: true }) theme: 'light' | 'dark' = 'dark';

  /**
   *  The current poster to load.
   */
  @Prop({ mutable: true }) poster = `${BASE_MEDIA_URL}/poster.png`;

  componentDidLoad() {
    (window as any).player = this.player;
  }

  componentWillRender() {
    const defaultSrc: any = {
      [Provider.Audio]: `${BASE_MEDIA_URL}/audio.mp3`,
      [Provider.Video]: `${BASE_MEDIA_URL}/720p.mp4`,
      [Provider.HLS]: `${BASE_MEDIA_URL}/hls/index.m3u8`,
      [Provider.Dash]: `${BASE_MEDIA_URL}/mpd/manifest.mpd`,
      [Provider.YouTube]: 'DyTCOwB0DVw',
      [Provider.Vimeo]: '411652396',
      [Provider.Dailymotion]: 'k3b11PemcuTrmWvYe0q',
    };

    this.src = this.src ?? defaultSrc[this.provider];
  }

  private buildProviderChildren() {
    const mediaType: any = {
      [Provider.Audio]: 'audio/mp3',
      [Provider.Video]: 'video/mp4',
      [Provider.HLS]: 'application/x-mpegURL',
    };

    return (
      <Fragment>
        <source data-src={this.src} type={mediaType[this.provider]} />
        {
          (this.provider !== Provider.HLS) && (
            <Fragment>
              <track default kind="subtitles" src={`${BASE_MEDIA_URL}/subs/english.vtt`} srclang="en" label="English" />
              <track kind="subtitles" src={`${BASE_MEDIA_URL}/subs/spanish.vtt`} srclang="es" label="Spanish" />
            </Fragment>
          )
        }
      </Fragment>
    );
  }

  private buildProvider() {
    switch (this.provider) {
      case Provider.Audio:
        return (<vm-audio crossOrigin="">{this.buildProviderChildren()}</vm-audio>);
      case Provider.Video:
        return (<vm-video crossOrigin="" poster={this.poster}>{this.buildProviderChildren()}</vm-video>);
      case Provider.HLS:
        return (<vm-hls crossOrigin="" poster={this.poster}>{this.buildProviderChildren()}</vm-hls>);
      case Provider.Dash:
        return (<vm-dash crossOrigin="" poster={this.poster} src={this.src!} />);
      case Provider.YouTube:
        return (<vm-youtube videoId={this.src!} />);
      case Provider.Vimeo:
        return (<vm-vimeo videoId={this.src!} />);
      case Provider.Dailymotion:
        return (<vm-dailymotion videoId={this.src!} />);
      default:
        return undefined;
    }
  }

  private changeProvider(newProvider: Provider) {
    this.src = undefined;
    this.provider = newProvider;
  }

  private onCustomUiChange(e: Event) {
    this.showCustomUI = (e.target as HTMLInputElement).checked;
    if (this.showCustomUI) this.showControls = false;
  }

  private onThemeChange(e: Event) {
    this.theme = (e.target as HTMLInputElement).checked ? 'light' : 'dark';
  }

  private onControlsChange(e: Event) {
    this.showControls = (e.target as HTMLInputElement).checked;
    if (this.showControls) this.showCustomUI = false;
  }

  private onSrcChange(e: Event) {
    this.src = (e.target as HTMLInputElement).value;
  }

  render() {
    const buttons = Object.values(Provider)
      .map((provider) => (
        <button id="audio" type="button" onClick={() => this.changeProvider(provider)}>
          {provider}
        </button>
      ));

    return (
      <div class="playground">
        <div class="container">
          <vm-player
            controls={this.showControls}
            theme={this.theme}
            ref={(el: any) => { this.player = el; }}
          >
            {this.buildProvider()}
            {this.showCustomUI && <vm-default-ui />}
          </vm-player>
        </div>

        <div class="buttons">
          {buttons}
        </div>

        <div class="inputs">
          <label htmlFor="src">Src</label>
          <input type="text" id="src" value={this.src} onChange={this.onSrcChange.bind(this)} />
          <label htmlFor="poster">Poster</label>
          <input type="text" id="poster" value={this.poster} readonly />
          <div class="checkboxes">
            <label htmlFor="ui">Custom UI</label>
            <input type="checkbox" id="ui" checked={this.showCustomUI} onChange={this.onCustomUiChange.bind(this)} />
            <label htmlFor="theme">Light Theme</label>
            <input type="checkbox" id="theme" checked={this.theme === 'light'} onChange={this.onThemeChange.bind(this)} />
            <label htmlFor="controls">Native Controls</label>
            <input type="checkbox" id="controls" checked={this.showControls} onChange={this.onControlsChange.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
