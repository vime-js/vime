import {
  h, Method, Component, Prop,
} from '@stencil/core';
import { ViewType } from '../../../core/player/ViewType';
import { MediaFileProvider, MediaPreloadOption } from '../MediaFileProvider';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-video',
})
export class Video implements MediaFileProvider<HTMLMediaElement> {
  private fileProvider!: HTMLVimeFileElement;

  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  @Prop() willAttach = false;

  /**
   * @inheritdoc
   */
  @Prop() crossOrigin?: string;

  /**
   * @inheritdoc
   */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /**
   * @inheritdoc
   */
  @Prop() poster?: string;

  /**
   * @inheritdoc
   */
  @Prop() controlsList?: string;

  /**
   * @inheritdoc
   */
  @Prop({ attribute: 'auto-pip' }) autoPiP?: boolean;

  /**
   * @inheritdoc
   */
  @Prop({ attribute: 'disable-pip' }) disablePiP?: boolean;

  /**
   * @inheritdoc
   */
  @Prop() disableRemotePlayback?: boolean;

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    return this.fileProvider.getAdapter();
  }

  render() {
    return (
      // @ts-ignore
      <vime-file
        willAttach={this.willAttach}
        crossOrigin={this.crossOrigin}
        poster={this.poster}
        preload={this.preload}
        controlsList={this.controlsList}
        autoPiP={this.autoPiP}
        disablePiP={this.disablePiP}
        disableRemotePlayback={this.disableRemotePlayback}
        mediaTitle={this.mediaTitle}
        viewType={ViewType.Video}
        ref={(el: any) => { this.fileProvider = el; }}
      >
        <slot />
      </vime-file>
    );
  }
}
