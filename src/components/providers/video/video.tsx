import { Component, h, Listen, Method, Prop } from '@stencil/core';

import { ViewType } from '../../core/player/ViewType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import {
  MediaCrossOriginOption,
  MediaFileProvider,
  MediaPreloadOption,
} from '../file/MediaFileProvider';
import { withProviderConnect } from '../ProviderConnect';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vm-video',
})
export class Video implements MediaFileProvider<HTMLMediaElement> {
  private fileProvider!: HTMLVmFileElement;

  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  @Prop() willAttach = false;

  /**
   * @internal Whether an external SDK will manage the text tracks.
   */
  @Prop() hasCustomTextManager = false;

  /** @inheritdoc */
  @Prop() crossOrigin?: MediaCrossOriginOption;

  /** @inheritdoc */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /** @inheritdoc */
  @Prop() poster?: string;

  /** @inheritdoc */
  @Prop() controlsList?: string;

  /** @inheritdoc */
  @Prop({ attribute: 'auto-pip' }) autoPiP?: boolean;

  /** @inheritdoc */
  @Prop({ attribute: 'disable-pip' }) disablePiP?: boolean;

  /** @inheritdoc */
  @Prop() disableRemotePlayback?: boolean;

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  constructor() {
    withComponentRegistry(this);
    withProviderConnect(this);
  }

  @Listen('vmMediaProviderConnect')
  onProviderConnect(event: Event) {
    if (this.willAttach) event.stopImmediatePropagation();
  }

  @Listen('vmMediaProviderDisconnect')
  onProviderDisconnect(event: Event) {
    if (this.willAttach) event.stopImmediatePropagation();
  }

  /** @internal */
  @Method()
  async getAdapter() {
    return this.fileProvider?.getAdapter();
  }

  render() {
    return (
      <vm-file
        noConnect
        willAttach={this.willAttach}
        crossOrigin={this.crossOrigin}
        poster={this.poster}
        preload={this.preload}
        controlsList={this.controlsList}
        autoPiP={this.autoPiP}
        disablePiP={this.disablePiP}
        disableRemotePlayback={this.disableRemotePlayback}
        hasCustomTextManager={this.hasCustomTextManager}
        mediaTitle={this.mediaTitle}
        viewType={ViewType.Video}
        ref={(el: any) => {
          this.fileProvider = el;
        }}
      >
        <slot />
      </vm-file>
    );
  }
}
