/* eslint-disable max-len */
/* eslint-disable import/no-mutable-exports */

import { noop, listen, element } from 'svelte/internal';
import { is_function } from './unit';
import { try_on_svelte_destroy } from './svelte';

export const IS_CLIENT = typeof window !== 'undefined';
export const UA = (IS_CLIENT && window.navigator.userAgent.toLowerCase());
export const IS_IE = (UA && /msie|trident/.test(UA));
export const IS_IOS = (UA && /iphone|ipad|ipod|ios/.test(UA));
export const IS_ANDROID = (UA && /android/.test(UA));
export const IS_EDGE = (UA && UA.indexOf('edge/') > 0);
export const IS_CHROME = (UA && /chrome\/\d+/.test(UA) && !IS_EDGE);
export const IS_IPHONE = (IS_CLIENT && /(iPhone|iPod)/gi.test(navigator.platform));
export const IS_MOBILE = (IS_IOS || IS_ANDROID);

export const ORIGIN = (window.location.protocol !== 'file:')
  ? `${window.location.protocol}//${window.location.hostname}`
  : null;

export const watch_touch = cb => {
  if (!IS_CLIENT) return;

  let lastTouchTime = 0;

  const e1 = listen(document, 'touchstart', () => {
    lastTouchTime = new Date();
    cb(true);
  }, true);

  const e2 = listen(document, 'mousemove', () => {
    // Filter emulated events coming from touch events
    if (new Date() - lastTouchTime < 500) return;
    cb(false);
  }, true);

  try_on_svelte_destroy(() => {
    e1();
    e2();
  });
};

// @see https://developer.apple.com/documentation/webkitjs/htmlvideoelement/1633500-webkitenterfullscreen
export const can_fullscreen_video_in_safari = () => {
  const video = element('video');
  // !IS_CHROME to stop deprecated warnings.
  return !IS_CHROME && is_function(video.webkitEnterFullscreen);
};

// Reduced motion iOS & MacOS setting
// @see https://webkit.org/blog/7551/responsive-design-for-motion/
export const is_reduced_motion_preferred = () => IS_CLIENT &&
  'matchMedia' in window &&
  window.matchMedia('(prefers-reduced-motion)').matches;

export const can_play_hls_natively = () => {
  if (!IS_CLIENT) return false;
  const video = element('video');
  return video.canPlayType('application/vnd.apple.mpegurl');
};

// Chrome
// @see https://developers.google.com/web/updates/2018/10/watch-video-using-picture-in-picture
export const can_use_pip_in_chrome = () => {
  if (!IS_CLIENT) return false;
  const video = element('video');
  return !!document.pictureInPictureEnabled && !video.disablePictureInPicture;
};

// Safari
// iPhone safari appears to "support" PiP through the check, however PiP does not function.
// @see https://developer.apple.com/documentation/webkitjs/adding_picture_in_picture_to_your_safari_media_controls
export const can_use_pip_in_safari = () => {
  if (!IS_CLIENT) return false;
  const video = element('video');
  return video.webkitSupportsPresentationMode &&
    is_function(video.webkitSetPresentationMode) &&
    !IS_IPHONE;
};

export const can_use_pip = () => can_use_pip_in_chrome() || can_use_pip_in_safari();

/**
 * To detect autoplay, we create a video element and call play on it, if it is `paused` after
 * a `play()` call, autoplay is supported. Although this unintuitive, it works across browsers
 * and is currently the lightest way to detect autoplay without using a data source.
 *
 * @see https://github.com/ampproject/amphtml/blob/9bc8756536956780e249d895f3e1001acdee0bc0/src/utils/video.js#L25
 */
export const can_autoplay = (muted = true, playsinline = true) => {
  if (!IS_CLIENT) return false;

  const video = element('video');

  if (muted) {
    video.setAttribute('muted', '');
    video.muted = true;
  }

  if (playsinline) {
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.playsinline = true;
    video.webkitPlaysinline = true;
  }

  video.setAttribute('height', '0');
  video.setAttribute('width', '0');

  video.style.position = 'fixed';
  video.style.top = 0;
  video.style.width = 0;
  video.style.height = 0;
  video.style.opacity = 0;

  // Promise wrapped this way to catch both sync throws and async rejections.
  // More info: https://github.com/tc39/proposal-promise-try
  new Promise(resolve => resolve(video.play())).catch(noop);

  return Promise.resolve(!video.paused);
};
