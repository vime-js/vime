/* eslint-disable max-classes-per-file */

import {
  getConstructor,
  isArray,
  isBoolean,
  isFunction, isInstanceOf,
  isNull,
  isNumber,
  isObject, isPrototypeOf,
  isString,
  isUndefined,
} from '../unit';

const expectToBeTrueOnlyFor = (type: string, check: any) => {
  const inputs: Record<string, { input: any, isValid?: boolean }> = {
    array: { input: [] },
    string: { input: '' },
    noll: { input: null },
    notDefined: { input: undefined },
    number: { input: 0 },
    object: { input: {} },
    fn: { input: () => {} },
    boolean: { input: true },
  };

  inputs[type].isValid = true;

  // @ts-ignore
  Object.values(inputs)
    .forEach((input) => expect(check(input.input)).toBe((input as any).isValid || false));
};

describe('isArray', () => {
  it('should return true only if given an array', () => {
    expectToBeTrueOnlyFor('array', isArray);
  });
});

describe('isBoolean', () => {
  it('should return true only if given a boolean', () => {
    expectToBeTrueOnlyFor('boolean', isBoolean);
  });
});

describe('isObject', () => {
  it('should return true only if given an object', () => {
    expectToBeTrueOnlyFor('object', isObject);
  });
});

describe('isString', () => {
  it('should return true only if given a string', () => {
    expectToBeTrueOnlyFor('string', isString);
  });
});

describe('isNumber', () => {
  it('should return true only if given a number', () => {
    expectToBeTrueOnlyFor('number', isNumber);
  });
});

describe('isFunction', () => {
  it('should return true only if given a function', () => {
    expectToBeTrueOnlyFor('fn', isFunction);
  });
});

describe('isNull', () => {
  it('should return true only if given null', () => {
    expect(isNull(null)).toBeTruthy();
    expect(isNull('')).toBeFalsy();
    expect(isNull(0)).toBeFalsy();
    expect(isNull([])).toBeFalsy();
    expect(isNull({})).toBeFalsy();
    expect(isNull(undefined)).toBeFalsy();
  });
});

describe('isUndefined', () => {
  it('should return true only if given undefined', () => {
    expect(isUndefined(null)).toBeFalsy();
    expect(isUndefined('')).toBeFalsy();
    expect(isUndefined(0)).toBeFalsy();
    expect(isUndefined([])).toBeFalsy();
    expect(isUndefined({})).toBeFalsy();
    expect(isUndefined(undefined)).toBeTruthy();
  });
});

class Mock {}
class MockTwo extends Mock {}
class MockThree {}

const instance = new Mock();

describe('getConstructor', () => {
  it('should return false given null or undefined', () => {
    expect(getConstructor(null)).toBeFalsy();
    expect(getConstructor(undefined)).toBeFalsy();
  });

  it('should return constructor given valid input', () => {
    const str = 'str';

    expect(getConstructor(str)).toBe(str.constructor);
  });
});

describe('isInstanceOf`', () => {
  it('should return true given input is a instance of class', () => {
    expect(isInstanceOf(instance, Mock)).toBeTruthy();
  });

  it('should return false given null input or null constructor', () => {
    expect(isInstanceOf(null, Mock)).toBeFalsy();
    expect(isInstanceOf('', null)).toBeFalsy();
  });

  it('should return false given input is not a instance of class', () => {
    expect(isInstanceOf(instance, MockTwo)).toBeFalsy();
  });
});

describe('isPrototypeOf', () => {
  it('should return true given input is prototype of object', () => {
    expect(isPrototypeOf(new MockTwo(), Mock)).toBeTruthy();
  });

  it('should return false given input is not prototype of object', () => {
    expect(isPrototypeOf(new MockThree(), Mock)).toBeFalsy();
  });
});
