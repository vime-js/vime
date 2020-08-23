import { h, Component, Prop } from '@stencil/core';

/**
 * @slot - Used to extend the default user interface with custom UI components.
 */
@Component({
  tag: 'vime-default-ui',
})
export class DefaultUI {
  /**
   * Whether the default icons should not be loaded.
   */
  @Prop() noIcons = false;

  /**
   * Whether clicking the player should not toggle playback.
   */
  @Prop() noClickToPlay = false;

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

  render() {
    return (
      <vime-ui>
        {!this.noIcons && <vime-icons />}
        {!this.noClickToPlay && <vime-click-to-play />}
        {!this.noCaptions && <vime-captions />}
        {!this.noPoster && <vime-poster />}
        {!this.noSpinner && <vime-spinner />}
        {!this.noControls && <vime-default-controls />}
        {!this.noSettings && <vime-default-settings />}
        <slot />
      </vime-ui>
    );
  }
}
