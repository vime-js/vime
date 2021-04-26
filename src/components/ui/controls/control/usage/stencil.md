```tsx {35-45}
import { h, Component, Prop } from '@stencil/core';
import {
  Dispatcher,
  createDispatcher,
  PlayerProps,
  withPlayerContext,
} from '@vime/core';

@Component({
  tag: 'playback-control',
})
export class PlaybackControl {
  private dispatch!: Dispatcher;

  /** @internal */
  @Prop() paused: PlayerProps['paused'] = true;

  /** @internal */
  @Prop() i18n: PlayerProps['i18n'] = {};

  connectedCallback() {
    this.dispatch = createDispatcher(this);
  }

  private onClick() {
    this.dispatch('paused', !this.paused);
  }

  render() {
    return (
      <vm-control
        keys="k"
        label={this.i18n.playback}
        pressed={this.paused}
        onClick={this.onClick.bind(this)}
      >
        <vm-icon name={this.paused ? 'play' : 'pause'} />
        <vm-tooltip>
          {this.paused ? this.i18n.play : this.i18n.pause} (k)
        </vm-tooltip>
      </vm-control>
    );
  }
}

withPlayerContext(PlaybackControl, ['paused', 'i18n']);
```
