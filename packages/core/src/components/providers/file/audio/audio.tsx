import {
  h, Method, Component, Prop,
} from '@stencil/core';
import { ViewType } from '../../../core/player/ViewType';
import { MediaFileProvider, MediaPreloadOption } from '../MediaFileProvider';
import { isString } from '../../../../utils/unit';
import { audioRegex } from '../utils';

/**
 * @slot - Pass `<source>` and `<track>` elements to the underlying HTML5 media player.
 */
@Component({
  tag: 'vime-audio',
})
export class Audio implements MediaFileProvider<HTMLMediaElement> {
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
  @Prop() disableRemotePlayback?: boolean;

  /**
   * @internal
   */
  @Method()
  async getAdapter() {
    const adapter = await this.fileProvider.getAdapter();
    adapter.canPlay = async (type: any) => isString(type) && audioRegex.test(type);
    return adapter;
  }

  render() {
    return (
      // @ts-ignore
      <vime-file
        willAttach={this.willAttach}
        crossOrigin={this.crossOrigin}
        preload={this.preload}
        disableRemotePlayback={this.disableRemotePlayback}
        viewType={ViewType.Audio}
        ref={(el: any) => { this.fileProvider = el; }}
      >
        <slot />
      </vime-file>
    );
  }
}
