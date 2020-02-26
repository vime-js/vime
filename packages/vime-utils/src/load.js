export const load_script = (src, onLoad, onError) => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  script.onerror = onError;

  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
};

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const load_image = (src, minWidth = 1) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const handler = () => {
      delete image.onload;
      delete image.onerror;
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };
    Object.assign(image, { onload: handler, onerror: handler, src });
  });
};

/**
 * Loads an external SDK or returns it if it's already loaded
 * Params: YouTube -> id = 'YT' and readyCallbackId = 'onYouTubeIframeAPIReady'
 */
export const sdkRequests = {};
export const load_sdk = (src, id, readyCallbackId = null, isLoaded = () => true) => {
  if (window[id] && isLoaded(window[id])) {
    return Promise.resolve(window[id]);
  }

  return new Promise((resolve, reject) => {
    // If we are already loading the SDK, add the resolve and reject functions to the existing
    // array of pending requests.
    if (sdkRequests[src]) {
      sdkRequests[src].push({ resolve, reject });
      return;
    }

    sdkRequests[src] = [{ resolve, reject }];

    const onLoad = sdk => {
      sdkRequests[src].forEach(request => request.resolve(sdk));
    };

    if (readyCallbackId) {
      const previousOnReady = window[readyCallbackId];
      window[readyCallbackId] = function () {
        if (previousOnReady) previousOnReady();
        onLoad(window[id]);
      };
    }

    load_script(
      src,
      () => { if (!readyCallbackId) onLoad(window[id]); },
      () => {
        sdkRequests[src].forEach(request => request.reject`Failed to load: ${src}`);
        sdkRequests[src] = null;
      }
    );
  });
};
