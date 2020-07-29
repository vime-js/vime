import { Component, Prop } from '@stencil/core';
import { loadSprite } from '../../../utils/network';

const cache = new Set();

@Component({
  tag: 'vime-icons',
})
export class Icons {
  /**
   * The URL to an SVG sprite to load.
   */
  @Prop() href = 'https://cdn.jsdelivr.net/npm/@vime-js/complete/static/sprite.svg';

  componentWillLoad() {
    if (!cache.has(this.href)) {
      cache.add(this.href);
      return loadSprite(this.href);
    }

    return undefined;
  }
}
