/**
 * INSPIRED BY: https://shoelace.style/components/icon-library
 */

import {
  Component, Element, Prop, Watch,
} from '@stencil/core';
import { deregisterIconLibrary, IconLibraryResolver, registerIconLibrary } from './IconRegistry';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import { PlayerProps } from '../../core/player/PlayerProps';
import { isUndefined } from '../../../utils/unit';

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
    registerIconLibrary(this.name ?? this.icons, this.name ? this.resolver : undefined);
  }
}
