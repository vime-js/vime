export const isNull = (input: any) => input === null;
export const isUndefined = (input: any) => typeof input === 'undefined';
export const isNullOrUndefined = (input: any) => isNull(input) || isUndefined(input);

export const getConstructor = (input: any): object | undefined => (
  !isNullOrUndefined(input) ? input.constructor : undefined
);

export const isObject = (input: any) => getConstructor(input) === Object;
export const isNumber = (input: any) => getConstructor(input) === Number && !Number.isNaN(input);
export const isString = (input: any) => getConstructor(input) === String;
export const isBoolean = (input: any) => getConstructor(input) === Boolean;
export const isFunction = (input: any) => getConstructor(input) === Function;
export const isArray = (input: any) => Array.isArray(input);

export const isInstanceOf = (input: any, constructor: any) => Boolean(
  input && constructor && input instanceof constructor,
);

export const isPrototypeOf = (input: any, object: any) => Boolean(
  input && object && Object.isPrototypeOf.call(object.prototype, input),
);
