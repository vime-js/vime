import { h, Component } from '@stencil/core';

@Component({
  tag: 'vime-default-ui',
})
export class DefaultUI {
  render() {
    return (
      <vime-ui>
        <vime-icons />
        <vime-click-to-play />
        <vime-captions />
        <vime-poster />
        <vime-spinner />
        <vime-default-controls />
        <vime-default-settings />
      </vime-ui>
    );
  }
}
