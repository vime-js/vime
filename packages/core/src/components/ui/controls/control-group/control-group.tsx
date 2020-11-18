import {
  h, Component, Element, Prop,
} from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

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
          spaceTop: (this.space !== 'none' && this.space !== 'bottom'),
          spaceBottom: (this.space !== 'none' && this.space !== 'top'),
        }}
      >
        <slot />
      </div>
    );
  }
}
