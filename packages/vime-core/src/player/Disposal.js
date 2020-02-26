import { run_all } from 'svelte/internal';
import { try_on_svelte_destroy } from '@vime/utils';

export default class Disposal {
  constructor () {
    this._dispose = [];
    try_on_svelte_destroy(() => this.dispose());
  }

  add (cb) {
    this._dispose.push(cb);
  }

  dispose () {
    run_all(this._dispose);
    this._dispose = [];
  }
}
