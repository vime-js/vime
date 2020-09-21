import {
  Component, Element, Prop, Watch,
} from '@stencil/core';
import { findShadowRoot } from '../../../utils/dom';
import { loadSprite } from '../../../utils/network';
import { isNull } from '../../../utils/unit';

@Component({
  tag: 'vime-icons',
})
export class Icons {
  @Element() el!: HTMLVimeIconsElement;

  /**
   * The URL to an SVG sprite to load.
   */
  @Prop() href = 'https://cdn.jsdelivr.net/npm/@vime/core@latest/icons/sprite.svg';

  @Watch('href')
  loadIcons() {
    return this.hasLoaded() ? undefined : loadSprite(this.href, this.findRoot());
  }

  componentWillLoad() {
    return this.loadIcons();
  }

  disconnectedCallback() {
    this.findExistingSprite()?.remove();
  }

  private findRoot() {
    return findShadowRoot(this.el) ?? document.head;
  }

  private findExistingSprite() {
    return this.findRoot().querySelector(`div[data-sprite="${this.href}"]`);
  }

  private hasLoaded() {
    return !isNull(this.findExistingSprite());
  }
}
