import { h, Component, Prop } from '@stencil/core';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';

/**
 * @slot - Used to extend the default user interface with custom UI components.
 */
@Component({
  tag: 'vm-default-ui',
  styleUrl: 'default-ui.css',
  shadow: true,
})
export class DefaultUI {
  /**
   * Whether clicking the player should not toggle playback.
   */
  @Prop() noClickToPlay = false;

  /**
   * Whether double clicking the player should not toggle fullscreen mode.
   */
  @Prop() noDblClickFullscreen = false;

  /**
   * Whether the custom captions UI should not be loaded.
   */
  @Prop() noCaptions = false;

  /**
   * Whether the custom poster UI should not be loaded.
   */
  @Prop() noPoster = false;

  /**
   * Whether the custom spinner UI should not be loaded.
   */
  @Prop() noSpinner = false;

  /**
   * Whether the custom default controls should not be loaded.
   */
  @Prop() noControls = false;

  /**
   * Whether the custom default settings menu should not be loaded.
   */
  @Prop() noSettings = false;

  /**
   * Whether the default loading screen should not be loaded.
   */
  @Prop() noLoadingScreen = false;

  constructor() {
    withComponentRegistry(this);
  }

  render() {
    return (
      <vm-ui>
        {!this.noClickToPlay && <vm-click-to-play />}
        {!this.noDblClickFullscreen && <vm-dbl-click-fullscreen />}
        {!this.noCaptions && <vm-captions />}
        {!this.noPoster && <vm-poster />}
        {!this.noSpinner && <vm-spinner />}
        {!this.noLoadingScreen && <vm-loading-screen />}
        {!this.noControls && <vm-default-controls />}
        {!this.noSettings && <vm-default-settings />}
        {!this.noSettings && <vm-default-settings />}
        <slot />
      </vm-ui>
    );
  }
}
