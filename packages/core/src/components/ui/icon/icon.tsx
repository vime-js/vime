import { Component, h, Prop } from '@stencil/core';
import { isString } from '../../../utils/unit';

/**
 * @slot - Used to pass in SVG markup to be drawn by the browser.
 */
@Component({
  tag: 'vime-icon',
  styleUrl: 'icon.css',
})
export class Icon {
  /**
   * The URL to an SVG element or fragment to load.
   */
  @Prop() href?: string;

  /**
   * The color (fill) of the icon.
   */
  @Prop() color?: string;

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
        {isString(this.href) ? <use href={this.href as string} /> : <slot />}
      </svg>
    );
  }
}
