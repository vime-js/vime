import { noop, listen } from 'svelte/internal';
import FullscreenApi from './FullscreenApi';
import { try_on_svelte_destroy } from '@vime/utils';

// @see https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
// @see https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
// @see https://github.com/videojs/video.js/blob/master/src/js/player.js#L2722
export default class Fullscreen {
  constructor (el) {
    this._el = el;
    this._onChange = null;
    this._onChangeListener = null;
    try_on_svelte_destroy(() => this.destroy());
    this._setupChangeListener();
  }

  _changed (active) {
    this._onChange && this._onChange(active);
  }

  _setupChangeListener () {
    if (!this.supported()) return;
    this._onChangeListener = listen(
      document, FullscreenApi.fullscreenchange, 
      () => this._changed(this.active())
    );
  }

  active () {
    let active = document[FullscreenApi.fullscreenElement] === this._el;
    if (!active && this._el.matches) active = this._el.matches(':' + FullscreenApi.fullscreen);
    return active;
  }

  supported () {
    return this._el && FullscreenApi.requestFullscreen;
  }

  onChange (cb) {
    this._onChange = cb;
  }

  requestFullscreen () {
    if (!this.supported()) return Promise.reject();
    const promise = this._el[FullscreenApi.requestFullscreen]();
    if (promise) promise.then(() => this._changed(true), () => this._changed(false));
    if (!promise && !this.active()) return Promise.reject(promise);
    return Promise.resolve(promise);
  }
  
  exitFullscreen () {
    if (!this.supported()) return Promise.reject();
    const promise = document[FullscreenApi.exitFullscreen]();
    if (promise) promise.then(() => this._changed(false));
    if (!promise && this.active()) return Promise.reject(promise);
    return Promise.resolve(promise);
  }

  destroy () {
    this._onChangeListener && this._onChangeListener();
  }
}