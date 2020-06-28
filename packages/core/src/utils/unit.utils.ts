export const is_null = (input: any) => input === null;
export const is_undefined = (input: any) => typeof input === 'undefined';
export const is_null_or_undefined = (input: any) => is_null(input) || is_undefined(input);

export const get_constructor = (input: any): undefined | object => (
  !is_null_or_undefined(input) ? input.constructor : undefined
);

export const is_object = (input: any) => get_constructor(input) === Object;
export const is_number = (input: any) => get_constructor(input) === Number && !Number.isNaN(input);
export const is_string = (input: any) => get_constructor(input) === String;
export const is_boolean = (input: any) => get_constructor(input) === Boolean;
export const is_function = (input) => get_constructor(input) === Function;
export const is_array = (input: any) => Array.isArray(input);

export const is_instance_of = (input: any, constructor: any) => Boolean(
  input && constructor && input instanceof constructor,
);

export const is_prototype_of = (input: any, object: any) => Boolean(
  input && object && Object.isPrototypeOf.call(object.prototype, input),
);