import {
  h, Host, Component, Element, Prop,
} from '@stencil/core';
import { isString } from '../../../utils/unit';
import { withPlayerContext } from '../../core/player/PlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';
import { TooltipDirection, TooltipPosition } from './types';

let tooltipIdCount = 0;

/**
 * @slot - Used to pass in the contents of the tooltip.
 */
@Component({
  tag: 'vime-tooltip',
  styleUrl: 'tooltip.scss',
})
export class Tooltip {
  // Avoid tooltips flashing when player initializing.
  private hasLoaded = false;

  @Element() el!: HTMLVimeTooltipElement;

  /**
   * Whether the tooltip is displayed or not.
   */
  @Prop() hidden = false;

  /**
   * Whether the tooltip is visible or not.
   */
  @Prop() active = false;

  /**
   * Determines if the tooltip appears on top/bottom of it's parent.
   */
  @Prop() position: TooltipPosition = 'top';

  /**
   * Determines if the tooltip should grow according to its contents to the left/right. By default
   * content grows outwards from the center.
   */
  @Prop() direction?: TooltipDirection;

  /**
   * @internal
   */
  @Prop() isTouch: PlayerProps['isTouch'] = false;

  componentDidLoad() {
    this.hasLoaded = true;
  }

  private getId() {
    // eslint-disable-next-line prefer-destructuring
    const id = this.el.id;
    if (isString(id) && id.length > 0) return id;
    tooltipIdCount += 1;
    return `vime-tooltip-${tooltipIdCount}`;
  }

  render() {
    return (
      <Host
        id={this.getId()}
        role="tooltip"
        aria-hidden={(!this.active || this.isTouch) ? 'true' : 'false'}
        class={{
          hidden: !this.hasLoaded || this.hidden,
          onTop: (this.position === 'top'),
          onBottom: (this.position === 'bottom'),
          growLeft: (this.direction === 'left'),
          growRight: (this.direction === 'right'),
        }}
      >
        <slot />
      </Host>
    );
  }
}

withPlayerContext(Tooltip, [
  'isTouch',
]);
