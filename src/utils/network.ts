import { IS_CLIENT } from './support';
import { isArray, isNil, isObject, isString, isUndefined, noop } from './unit';

/**
 * Attempt to parse json into a POJO.
 */
export function tryParseJSON<T>(json: string): T | undefined {
  if (!isString(json)) return undefined;

  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

/**
 * Check if the given input is json or a plain object.
 */
export const isObjOrJSON = (input: unknown): boolean =>
  !isNil(input) &&
  (isObject(input) || (isString(input) && input.startsWith('{')));

/**
 * If an object return otherwise try to parse it as json.
 */
export const objOrParseJSON = <T>(input: unknown): T | undefined =>
  isObject(input) ? (input as T) : tryParseJSON(input as string);

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const loadImage = (
  src: string,
  minWidth = 1,
): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const handler = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete image.onload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete image.onerror;
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };
    Object.assign(image, { onload: handler, onerror: handler, src });
  });

export const loadScript = (
  src: string,
  onLoad: () => void,
  onError: (e: unknown) => void = noop,
): void => {
  const script = document.createElement('script');
  script.src = src;
  script.onload = onLoad;
  script.onerror = onError;
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode?.insertBefore(script, firstScriptTag);
};

/**
 * Tries to parse json and return a object.
 */
export const decodeJSON = <T>(data: unknown): T | undefined => {
  if (!isObjOrJSON(data)) return undefined;
  return objOrParseJSON(data);
};

/**
 * Attempts to safely decode a URI component, on failure it returns the given fallback.
 */
export const tryDecodeURIComponent = (
  component: string,
  fallback = '',
): string => {
  if (!IS_CLIENT) return fallback;
  try {
    return window.decodeURIComponent(component);
  } catch (e) {
    return fallback;
  }
};

/**
 * Returns a simple key/value map and duplicate keys are merged into an array.
 *
 * @see https://github.com/ampproject/amphtml/blob/c7c46cec71bac92f5c5da31dcc6366c18577f566/src/url-parse-query-string.js#L31
 */
const QUERY_STRING_REGEX = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
export const parseQueryString = <T>(qs?: string): T => {
  const params = Object.create(null);

  if (isUndefined(qs)) return params;

  let match;

  // eslint-disable-next-line no-cond-assign
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  while ((match = QUERY_STRING_REGEX.exec(qs!))) {
    const name = tryDecodeURIComponent(match[1], match[1]).replace('[]', '');

    const value = isString(match[2])
      ? tryDecodeURIComponent(match[2].replace(/\+/g, ' '), match[2])
      : '';

    const currValue = params[name];

    if (currValue && !isArray(currValue)) params[name] = [currValue];

    currValue ? params[name].push(value) : (params[name] = value);
  }

  return params;
};

export type Params = Record<string, unknown>;

/**
 * Serializes the given params into a query string.
 */
export const serializeQueryString = (params: Params): string => {
  const qs: string[] = [];

  const appendQueryParam = (param: string, v: string) => {
    qs.push(`${encodeURIComponent(param)}=${encodeURIComponent(v)}`);
  };

  Object.keys(params).forEach(param => {
    const value = params[param];

    if (isNil(value)) return;

    if (isArray(value)) {
      (value as string[]).forEach((v: string) => appendQueryParam(param, v));
    } else {
      appendQueryParam(param, value as string);
    }
  });

  return qs.join('&');
};

/**
 * Notifies the browser to start establishing a connection with the given URL.
 */
export const preconnect = (
  url: string,
  rel: 'preconnect' | 'prefetch' | 'preload' = 'preconnect',
  as?: string,
): boolean => {
  if (!IS_CLIENT) return false;

  const link = document.createElement('link');
  link.rel = rel;
  link.href = url;
  if (!isUndefined(as)) link.as = as;
  link.crossOrigin = 'true';

  document.head.append(link);

  return true;
};

/**
 * Safely appends the given query string to the given URL.
 */
export const appendQueryStringToURL = (url: string, qs?: string): string => {
  if (isUndefined(qs) || qs.length === 0) return url;
  const mainAndQuery = url.split('?', 2);
  return (
    mainAndQuery[0] +
    (!isUndefined(mainAndQuery[1]) ? `?${mainAndQuery[1]}&${qs}` : `?${qs}`)
  );
};

/**
 * Serializes the given params into a query string and appends them to the given URL.
 */
export const appendParamsToURL = (
  url: string,
  params: string | Params,
): string =>
  appendQueryStringToURL(
    url,
    isObject(params)
      ? serializeQueryString(params as Params)
      : (params as string),
  );

/**
 * Tries to convert a query string into a object.
 */
export const decodeQueryString = <T>(qs: string): T | undefined => {
  if (!isString(qs)) return undefined;
  return parseQueryString(qs);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PendingSDKRequest<SDKType = any> = {
  resolve: (value: SDKType) => void;
  reject: (reason: unknown) => void;
};

const pendingSDKRequests: Record<string, PendingSDKRequest[]> = {};

/**
 * Loads an SDK into the global window namespace.
 *
 * @see https://github.com/CookPete/react-player/blob/master/src/utils.js#L77
 */
export const loadSDK = <SDKType = unknown>(
  url: string,
  sdkGlobalVar: string,
  sdkReadyVar?: string,
  isLoaded: (sdk: SDKType) => boolean = () => true,
  loadScriptFn = loadScript,
): Promise<SDKType> => {
  const getGlobal = (key: keyof Window) => {
    if (!isUndefined(window[key])) return window[key];
    if (window.exports && window.exports[key]) return window.exports[key];
    if (window.module && window.module.exports && window.module.exports[key]) {
      return window.module.exports[key];
    }
    return undefined;
  };

  const existingGlobal = getGlobal(sdkGlobalVar as keyof Window);

  if (existingGlobal && isLoaded(existingGlobal)) {
    return Promise.resolve(existingGlobal);
  }

  return new Promise<SDKType>((resolve, reject) => {
    if (!isUndefined(pendingSDKRequests[url])) {
      pendingSDKRequests[url].push({ resolve, reject });
      return;
    }

    pendingSDKRequests[url] = [{ resolve, reject }];

    const onLoaded = (sdk: SDKType) => {
      pendingSDKRequests[url].forEach(request => request.resolve(sdk));
    };

    if (!isUndefined(sdkReadyVar)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const previousOnReady: () => void = window[sdkReadyVar as any] as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)[sdkReadyVar as any] = function () {
        if (!isUndefined(previousOnReady)) previousOnReady();
        onLoaded(getGlobal(sdkGlobalVar as keyof Window));
      };
    }

    loadScriptFn(
      url,
      () => {
        if (isUndefined(sdkReadyVar))
          onLoaded(getGlobal(sdkGlobalVar as keyof Window));
      },
      e => {
        pendingSDKRequests[url].forEach(request => {
          request.reject(e);
        });
        delete pendingSDKRequests[url];
      },
    );
  });
};

export const loadSprite = (
  src: string,
  into?: HTMLElement | ShadowRoot,
): void => {
  if (!IS_CLIENT) return;
  window
    .fetch(src)
    .then(res => res.text())
    .then(sprite => {
      const div = document.createElement('div');
      div.setAttribute('data-sprite', src);
      div.style.display = 'none';
      div.innerHTML = sprite;
      (into ?? document.head).append(div);
    });
};
