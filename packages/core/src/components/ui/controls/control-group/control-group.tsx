import { Component, Element, h, Prop } from '@stencil/core';

import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

/**
 * A simple container that enables player controls to be organized into groups. Each group starts on
 * a new line.
 *
 * ## Visual
 *
 * <img
 *   src="https://raw.githubusercontent.com/vime-js/vime/master/packages/core/src/components/ui/controls/control-group/control-group.png"
 *   alt="Vime control group component"
 * />
 */
@Component({
  tag: 'vm-control-group',
  styleUrl: 'control-group.css',
  shadow: true,
})
export class ControlNewLine {
  @Element() host!: HTMLVmControlGroupElement;

  /**
   * Determines where to add spacing/margin. The amount of spacing is determined by the CSS variable
   * `--control-group-spacing`.
   */
  @Prop() space: 'top' | 'bottom' | 'both' | 'none' = 'none';

  constructor() {
    withComponentRegistry(this);
  }

  render() {
    return (
      <div
        class={{
          controlGroup: true,
          spaceTop: this.space !== 'none' && this.space !== 'bottom',
          spaceBottom: this.space !== 'none' && this.space !== 'top',
        }}
      >
        <slot />
      </div>
    );
  }
}
