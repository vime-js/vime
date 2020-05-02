// @see https://github.com/videojs/video.js/blob/7.6.x/src/js/fullscreen-api.js

const FullscreenApi = {
  prefixed: true,
};

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

export default function () {
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
      FullscreenApi[specApi[i]] = browserApi[i];
    }

    FullscreenApi.prefixed = browserApi[0] !== specApi[0];
  }

  return FullscreenApi;
}
