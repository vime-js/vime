/* eslint-disable no-underscore-dangle */

import { run_all } from 'svelte/internal';
import { try_on_svelte_destroy } from '@vime-js/utils';

export default class Disposal {
  constructor() {
    this._dispose = [];
    try_on_svelte_destroy(() => this.dispose());
  }

  add(callback) {
    this._dispose.push(callback);
  }

  dispose() {
    run_all(this._dispose);
    this._dispose = [];
  }
}
