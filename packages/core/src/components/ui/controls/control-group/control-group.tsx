import {
  h, Host, Component, Element, Prop,
} from '@stencil/core';

@Component({
  tag: 'vime-control-group',
  styleUrl: 'control-group.scss',
})
export class ControlNewLine {
  @Element() el!: HTMLVimeControlGroupElement;

  /**
   * Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable
   * `--control-group-spacing`.
   */
  @Prop() space: 'top' | 'bottom' | 'both' | 'none' = 'none';

  render() {
    return (
      <Host
        class={{
          spaceTop: (this.space !== 'none' && this.space !== 'bottom'),
          spaceBottom: (this.space !== 'none' && this.space !== 'top'),
        }}
      >
        <slot />
      </Host>
    );
  }
}
