/**
 * INSPIRED BY: https://shoelace.style/components/icon-library
 */

import { Component, Element, Prop, Watch } from '@stencil/core';

import { isUndefined } from '../../../utils/unit';
import { PlayerProps } from '../../core/player/PlayerProps';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import {
  deregisterIconLibrary,
  IconLibraryResolver,
  registerIconLibrary,
} from './IconRegistry';

/**
 * _This component was inspired by [Shoelace](https://shoelace.style/)._
 *
 * Loads and renders an SVG icon. The icon be loaded from an [icon library](./icon-library) or from
 * an absolute URL via the `src` property. Only SVGs on a local or CORS-enabled endpoint are
 * supported. If you're using more than one custom icon, it might make sense to register a custom
 * [icon library](./icon-library).
 */
@Component({
  tag: 'vm-icon-library',
  shadow: true,
})
export class IconLibrary {
  @Element() host!: HTMLVmIconLibraryElement;

  /**
   * The name of the icon library to register. Vime provides some default libraries out of the box
   * such as `vime`or `material`.
   */
  @Prop() name?: string;

  /**
   * A function that translates an icon name to a URL where the corresponding SVG file exists.
   * The URL can be local or a CORS-enabled endpoint.
   */
  @Prop() resolver?: IconLibraryResolver;

  /** @internal */
  @Prop() icons: PlayerProps['icons'] = 'material';

  @Watch('name')
  @Watch('resolver')
  @Watch('icons')
  handleUpdate() {
    this.register();
  }

  constructor() {
    withComponentRegistry(this);
    withPlayerContext(this, ['icons']);
  }

  connectedCallback() {
    this.register();
  }

  disconnectedCallback() {
    if (!isUndefined(this.name)) deregisterIconLibrary(this.name);
  }

  private register() {
    registerIconLibrary(
      this.name ?? this.icons,
      this.name ? this.resolver : undefined,
    );
  }
}
