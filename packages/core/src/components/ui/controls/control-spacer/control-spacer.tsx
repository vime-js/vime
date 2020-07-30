import { h, Host, Component } from '@stencil/core';

@Component({
  tag: 'vime-control-spacer',
  styleUrl: 'control-spacer.css',
})
export class ControlSpacer {
  render() {
    return (
      <Host />
    );
  }
}
