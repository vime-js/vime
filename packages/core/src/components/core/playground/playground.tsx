/* eslint-disable no-return-assign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {
  h, Fragment, Host, Component, Prop,
} from '@stencil/core';
import { Provider } from '../../providers/Provider';

const BASE_MEDIA_URL = 'https://media.vimejs.com';

@Component({
  tag: 'vime-playground',
  styleUrl: 'playground.scss',
})
export class Playground {
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
   * The current custom UI theme, won't work if custom UI is turned off.
   */
  @Prop({ mutable: true }) theme: 'light' | 'dark' = 'dark';

  /**
   *  The current poster to load.
   */
  @Prop({ mutable: true }) poster = `${BASE_MEDIA_URL}/poster.png`;

  private buildProviderChildren() {
    const defaultSrc: any = {
      [Provider.Audio]: `${BASE_MEDIA_URL}/audio.mp3`,
      [Provider.Video]: `${BASE_MEDIA_URL}/720p.mp4`,
      [Provider.HLS]: `${BASE_MEDIA_URL}/hls/index.m3u8`,
    };

    const mediaType: any = {
      [Provider.Audio]: 'audio/mp3',
      [Provider.Video]: 'video/mp4',
      [Provider.HLS]: 'application/x-mpegURL',
    };

    return (
      <Fragment>
        <source
          data-src={this.src ?? (this.src = defaultSrc[this.provider])}
          type={mediaType[this.provider]}
        />
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
        return (<vime-audio crossOrigin="">{this.buildProviderChildren()}</vime-audio>);
      case Provider.Video:
        return (<vime-video crossOrigin="" poster={this.poster}>{this.buildProviderChildren()}</vime-video>);
      case Provider.HLS:
        return (<vime-hls crossOrigin="" poster={this.poster}>{this.buildProviderChildren()}</vime-hls>);
      case Provider.Dash:
        return (<vime-dash crossOrigin="" poster={this.poster} src={this.src ?? (this.src = `${BASE_MEDIA_URL}/mpd/manifest.mpd`)} />);
      case Provider.YouTube:
        return (<vime-youtube videoId={this.src ?? (this.src = 'DyTCOwB0DVw')} />);
      case Provider.Vimeo:
        return (<vime-vimeo videoId={this.src ?? (this.src = '411652396')} />);
      case Provider.Dailymotion:
        return (<vime-dailymotion videoId={this.src ?? (this.src = 'k3b11PemcuTrmWvYe0q')} />);
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
  }

  private onThemeChange(e: Event) {
    this.theme = (e.target as HTMLInputElement).checked ? 'light' : 'dark';
  }

  private onSrcChange(e: Event) {
    this.src = (e.target as HTMLInputElement).value;
  }

  render() {
    const buttons = Object.values(Provider)
      .filter((provider) => provider !== 'faketube')
      .map((provider) => (
        <button id="audio" type="button" onClick={() => this.changeProvider(provider)}>
          {provider}
        </button>
      ));

    return (
      <Host>
        <div class="container">
          <vime-player
            controls={!this.showCustomUI}
            theme={this.theme}
          >
            {this.buildProvider()}
            {this.showCustomUI && <vime-default-ui />}
          </vime-player>
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
          </div>
        </div>
      </Host>
    );
  }
}
