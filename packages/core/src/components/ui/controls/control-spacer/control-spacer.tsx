import { Component } from '@stencil/core';
import { withComponentRegistry } from '../../../core/player/withComponentRegistry';

@Component({
  tag: 'vm-control-spacer',
  styleUrl: 'control-spacer.css',
  shadow: true,
})
export class ControlSpacer {
  constructor() {
    withComponentRegistry(this);
  }
}
