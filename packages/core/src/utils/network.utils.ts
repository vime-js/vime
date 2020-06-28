import { is_string, is_array, is_null_or_undefined, is_object } from './unit.utils';
import { IS_CLIENT } from './index';

/**
 * Attempt to parse json into a POJO.
 */
export function try_parse_json(json: string): undefined | object {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

/**
 * Check if the given input is json or a plain object.
 */
export const is_json_or_obj = (input: any): boolean => !is_null_or_undefined(input)
  && (is_object(input) || input.startsWith('{'));

/**
 * If an object return otherwise try to parse it as json.
 */
export const obj_or_try_parse_json = (input: any): undefined | object => is_object(input)
  ? input
  : try_parse_json(input);

/**
 * Load image avoiding xhr/fetch CORS issues. Server status can't be obtained this way
 * unfortunately, so this uses "naturalWidth" to determine if the image has been loaded. By
 * default it checks if it is at least 1px.
 */
export const load_image = (src: string, minWidth = 1): Promise<HTMLImageElement> => new Promise(
  (resolve, reject) => {
    const image = new Image();
    const handler = () => {
      delete image.onload;
      delete image.onerror;
      image.naturalWidth >= minWidth ? resolve(image) : reject(image);
    };
    Object.assign(image, { onload: handler, onerror: handler, src });
  }
);

/**
 * Tries to parse json and return a object.
 */
export const decode_json = (data: any): false | object => is_json_or_obj(data) && obj_or_try_parse_json(data);

/**
 * Tries to convert a query string into a object.
 */
export const decode_query_string = (data: any): false | object => is_string(data) && parse_query_string(data);

export const try_decode_uri_component = (component: string, fallback = ''): string => {
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
export const parse_query_string = (qs: any): { [id: string]: string | string[] } => {
  const params = Object.create(undefined);

  if (!qs) return params;

  let match;
  // eslint-disable-next-line @stencil/strict-boolean-conditions
  while ((match = QUERY_STRING_REGEX.exec(qs))) {
    const name = try_decode_uri_component(match[1], match[1]).replace('[]', '');
    const value = match[2]
      ? try_decode_uri_component(match[2].replace(/\+/g, ' '), match[2])
      : '';
    const currValue = params[name];
    if (currValue && !is_array(currValue)) params[name] = [currValue];
    currValue ? params[name].push(value) : (params[name] = value);
  }

  return params;
};
