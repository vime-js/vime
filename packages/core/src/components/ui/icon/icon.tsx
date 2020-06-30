import { Component, h, Prop } from '@stencil/core';
import { isString } from '../../../utils/unit';

/**
 * Displays an SVG icon inline or loaded from a sprite.
 */
@Component({
  tag: 'vime-icon',
  styleUrl: 'icon.css',
})
export class Icon {
  /**
   * The icon SVG identifier. It's expected that this points to an SVG inside a loaded sprite.
   */
  @Prop() icon?: string;

  /**
   * The color (fill) of the icon.
   */
  @Prop() color = '#fff';

  /**
   * The amount to scale the size of the icon (respecting aspect ratio) up or down by.
   */
  @Prop() scale = 1;

  /**
   * The amount of transparency to add to the icon.
   */
  @Prop() opacity = 1;

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        focusable="false"
        style={{
          color: this.color,
          transform: `scale(${this.scale})`,
          opacity: `${this.opacity}`,
        }}
      >
        {isString(this.icon) ? <use href={this.icon as string} /> : ''}
        <slot />
      </svg>
    );
  }
}
