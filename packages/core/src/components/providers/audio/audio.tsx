import { Component, h, Method, Prop } from '@stencil/core';

import { isString } from '../../../utils/unit';
import { ViewType } from '../../core/player/ViewType';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import {
  MediaCrossOriginOption,
  MediaFileProvider,
  MediaPreloadOption,
} from '../file/MediaFileProvider';
import { audioRegex } from '../file/utils';
import { withProviderConnect } from '../ProviderConnect';

/**
 * Enables loading, playing and controlling audio via the
 * HTML5 [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element.
 *
 * > You don't interact with this component for passing player properties, controlling playback,
 * listening to player events and so on, that is all done through the `vime-player` component.
 *
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vm-audio',
})
export class Audio implements MediaFileProvider<HTMLMediaElement> {
  private fileProvider!: HTMLVmFileElement;

  /**
   * @internal Whether an external SDK will attach itself to the media player and control it.
   */
  @Prop() willAttach = false;

  /** @inheritdoc */
  @Prop() crossOrigin?: MediaCrossOriginOption;

  /** @inheritdoc */
  @Prop() preload?: MediaPreloadOption = 'metadata';

  /** @inheritdoc */
  @Prop() disableRemotePlayback?: boolean;

  /**
   * The title of the current media.
   */
  @Prop() mediaTitle?: string;

  constructor() {
    withComponentRegistry(this);
    if (!this.willAttach) withProviderConnect(this);
  }

  /** @internal */
  @Method()
  async getAdapter() {
    const adapter = (await this.fileProvider?.getAdapter()) ?? {};
    adapter.canPlay = async (type: any) =>
      isString(type) && audioRegex.test(type);
    return adapter;
  }

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <vm-file
        noConnect
        willAttach={this.willAttach}
        crossOrigin={this.crossOrigin}
        preload={this.preload}
        disableRemotePlayback={this.disableRemotePlayback}
        mediaTitle={this.mediaTitle}
        viewType={ViewType.Audio}
        ref={(el: any) => {
          this.fileProvider = el;
        }}
      >
        <slot />
      </vm-file>
    );
  }
}
