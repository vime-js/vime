/**
 * INSPIRED BY: https://github.com/shoelace-style/shoelace/blob/next/src/components/icon/icon.tsx
 */

import {
  Component,
  Event,
  EventEmitter,
  h,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';

import { PlayerProps } from '../../..';
import { withComponentRegistry } from '../../core/player/withComponentRegistry';
import { withPlayerContext } from '../../core/player/withPlayerContext';
import {
  getIconLibraryResolver,
  withIconRegistry,
} from '../icon-library/IconRegistry';
import { requestIcon } from './requestIcon';

const parser = new DOMParser();

/**
 * _This component was inspired by [Shoelace](https://shoelace.style/)._
 *
 * **Icon libraries let you register additional icons to be used throughout the player.**
 *
 * An icon library is a renderless component that registers a custom set of SVG icons. The icon
 * files can exist locally or on a CORS-enabled endpoint (eg: CDN). There is no limit to how many
 * icon libraries you can register, and there is no cost associated with registering them, as
 * individual icons are only requested when they're used.
 *
 * By default, Vime provides the `vime` and `material` icon sets, to register your own icon
 * library create an `<vm-icon-library>` element with a name and resolver function. The resolver
 * function translates an icon name to a URL where its corresponding SVG file exists.
 *
 * Refer to the examples below and in the [icon](./icon) component to better understand how it all
 * works.
 */
@Component({
  tag: 'vm-icon',
  styleUrl: 'icon.css',
  shadow: true,
})
export class Icon {
  @State() svg?: string;

  /**
   * The name of the icon to draw.
   */
  @Prop() name?: string;

  /**
   * The absolute URL of an SVG file to load.
   */
  @Prop() src?: string;

  /**
   * An alternative description to use for accessibility. If omitted, the name or src will be used
   * to generate it.
   */
  @Prop() label?: string;

  /**
   * The name of a registered icon library.
   */
  @Prop() library?: string;

  /** @internal */
  @Prop() icons: PlayerProps['icons'] = 'material';

  /**
   * Emitted when the icon has loaded.
   */
  @Event() vmLoad!: EventEmitter<void>;

  /**
   * Emitted when the icon failed to load.
   */
  @Event() vmError!: EventEmitter<{ status?: number }>;

  @Watch('name')
  @Watch('src')
  @Watch('library')
  @Watch('icons')
  handleChange() {
    this.setIcon();
  }

  constructor() {
    withComponentRegistry(this);
    withIconRegistry(this);
  }

  connectedCallback() {
    withPlayerContext(this, ['icons']);
  }

  componentDidLoad() {
    this.setIcon();
  }

  /**
   * @internal Fetches the icon and redraws it. Used to handle library registrations.
   */
  @Method()
  async redraw() {
    this.setIcon();
  }

  getLabel() {
    let label = '';

    if (this.label) {
      label = this.label;
    } else if (this.name) {
      label = this.name.replace(/-/g, ' ');
    } else if (this.src) {
      label = this.src
        .replace(/.*\//, '')
        .replace(/-/g, ' ')
        .replace(/\.svg/i, '');
    }

    return label;
  }

  async setIcon() {
    const resolver = getIconLibraryResolver(this.library ?? this.icons);

    let url = this.src;

    if (this.name && resolver) {
      url = resolver(this.name);
    }

    if (url) {
      try {
        const file = await requestIcon(url)!;

        if (file.ok) {
          const doc = parser.parseFromString(file!.svg!, 'text/html');
          const svg = doc.body.querySelector('svg');

          if (svg) {
            this.svg = svg.outerHTML;
            this.vmLoad.emit();
          } else {
            this.svg = '';
            this.vmError.emit({ status: file.status });
          }
        }
      } catch {
        this.vmError.emit();
      }
    }
  }

  render() {
    return (
      <div
        class="icon"
        role="img"
        aria-label={this.getLabel()}
        innerHTML={this.svg}
      />
    );
  }
}
