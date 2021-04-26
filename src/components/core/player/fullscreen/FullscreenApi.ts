const apiMap = [
  [
    'requestFullscreen',
    'exitFullscreen',
    'fullscreenElement',
    'fullscreenEnabled',
    'fullscreenchange',
    'fullscreenerror',
    'fullscreen',
  ],
  // WebKit
  [
    'webkitRequestFullscreen',
    'webkitExitFullscreen',
    'webkitFullscreenElement',
    'webkitFullscreenEnabled',
    'webkitfullscreenchange',
    'webkitfullscreenerror',
    '-webkit-full-screen',
  ],
  // Mozilla
  [
    'mozRequestFullScreen',
    'mozCancelFullScreen',
    'mozFullScreenElement',
    'mozFullScreenEnabled',
    'mozfullscreenchange',
    'mozfullscreenerror',
    '-moz-full-screen',
  ],
  // Microsoft
  [
    'msRequestFullscreen',
    'msExitFullscreen',
    'msFullscreenElement',
    'msFullscreenEnabled',
    'MSFullscreenChange',
    'MSFullscreenError',
    '-ms-fullscreen',
  ],
];

interface FullscreenApi {
  prefixed: boolean;
  requestFullscreen?: string;
  exitFullscreen?: string;
  fullscreenElement?: string;
  fullscreenEnabled?: string;
  fullscreenchange?: string;
  fullscreenerror?: string;
  fullscreen?: string;
}

/**
 * Normalizes native fullscreen API differences across browsers.
 *
 * @ref https://github.com/videojs/video.js/blob/7.6.x/src/js/fullscreen-api.js
 */
export const getFullscreenApi = (): FullscreenApi => {
  const api: any = { prefixed: false };
  const specApi = apiMap[0];

  let browserApi;

  // Determine the supported set of functions.
  for (let i = 0; i < apiMap.length; i += 1) {
    // Check for exitFullscreen function.
    if (apiMap[i][1] in document) {
      browserApi = apiMap[i];
      break;
    }
  }

  // Map the browser API names to the spec API names.
  if (browserApi) {
    for (let i = 0; i < browserApi.length; i += 1) {
      api[specApi[i]] = browserApi[i];
    }

    api.prefixed = browserApi[0] !== specApi[0];
  }

  return api;
};
