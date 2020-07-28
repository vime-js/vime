import { h, Component } from '@stencil/core';

@Component({
  tag: 'vime-ui',
  styleUrl: 'ui.scss',
})
export class UI {
  render() {
    return (<slot />);
  }
}
