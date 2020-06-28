import { Component, h, Prop } from '@stencil/core';
import { is_string } from '../../utils';

/**
 * Displays an SVG icon inline or loaded from a sprite.
 */
@Component({
  tag: 'vime-icon',
  styleUrl: 'vime-icon.css',
  shadow: true
})
export class Icon {
  /**
   * The icon SVG identifier if a sprite is loaded otherwise plain svg to inline.
   */
  @Prop() icon!: string | SVGElement;

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

  render () {
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
        {is_string(this.icon) ? <use href={this.icon as string}></use> : this.icon}
      </svg>
    );
  }
}
