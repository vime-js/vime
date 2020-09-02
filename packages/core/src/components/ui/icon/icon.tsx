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

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        focusable="false"
      >
        {isString(this.href) ? <use href={this.href as string} /> : <slot />}
      </svg>
    );
  }
}
