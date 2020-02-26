import {
  is_array, is_boolean, is_empty, is_function, is_null, is_number, is_object, is_string,
  is_instance_of, get_constructor, is_prototype_of
} from '../unit';

describe('utils', () => {
  describe('unit', () => {
    const expectToBeTrueOnlyFor = (type, check) => {
      const inputs = {
        array: { input: [] },
        string: { input: '' },
        noll: { input: null },
        notDefined: { input: undefined },
        number: { input: 0 },
        object: { input: {} },
        fn: { input: () => {} },
        boolean: { input: true }
      };

      inputs[type].isValid = true;

      Object.values(inputs)
        .forEach((input) => expect(check(input.input)).toBe(input.isValid || false));
    };

    describe('is_array', () => {
      it('should return true only if given an array', () => {
        expectToBeTrueOnlyFor('array', is_array);
      });
    });

    describe('is_boolean', () => {
      it('should return true only if given a boolean', () => {
        expectToBeTrueOnlyFor('boolean', is_boolean);
      });
    });

    describe('is_object', () => {
      it('should return true only if given an object', () => {
        expectToBeTrueOnlyFor('object', is_object);
      });
    });

    describe('is_string', () => {
      it('should return true only if given a string', () => {
        expectToBeTrueOnlyFor('string', is_string);
      });
    });

    describe('is_number', () => {
      it('should return true only if given a number', () => {
        expectToBeTrueOnlyFor('number', is_number);
      });
    });

    describe('is_function', () => {
      it('should return true only if given a function', () => {
        expectToBeTrueOnlyFor('fn', is_function);
      });
    });

    describe('is_empty', () => {
      it('should return false given non-empty inputs', () => {
        expect(is_empty([1, 2, 3])).toBeFalsy();
        expect(is_empty('fox')).toBeFalsy();
        expect(is_empty({ a: 1 })).toBeFalsy();
      });

      it('should return true given empty inputs', () => {
        expect(is_empty([])).toBeTruthy();
        expect(is_empty('')).toBeTruthy();
        expect(is_empty({})).toBeTruthy();
        expect(is_empty(null)).toBeTruthy();
        expect(is_empty(undefined)).toBeTruthy();
      });
    });

    describe('is_null', () => {
      it('should return true only if given null or undefined', () => {
        expect(is_null(null)).toBeTruthy();
        expect(is_null(undefined)).toBeTruthy();
        expect(is_null('')).toBeFalsy();
        expect(is_null(0)).toBeFalsy();
        expect(is_null([])).toBeFalsy();
        expect(is_null({})).toBeFalsy();
      });
    });
  });

  describe('prototype', () => {
    class Mock {}
    class MockTwo extends Mock {}
    class MockThree {}

    const instance = new Mock();

    describe('get_constructor', () => {
      it('should return false given null or undefined', () => {
        expect(get_constructor(null)).toBeFalsy();
        expect(get_constructor(undefined)).toBeFalsy();
      });

      it('should return constructor given valid input', () => {
        const str = 'str';

        expect(get_constructor(str)).toBe(str.constructor);
      });
    });

    describe('is_instance_of`', () => {
      it('should return true given input is a instance of class', () => {
        expect(is_instance_of(instance, Mock)).toBeTruthy();
      });

      it('should return false given null input or null constructor', () => {
        expect(is_instance_of(null, Mock)).toBeFalsy();
        expect(is_instance_of('', null)).toBeFalsy();
      });

      it('should return false given input is not a instance of class', () => {
        expect(is_instance_of(instance, MockTwo)).toBeFalsy();
      });
    });

    describe('is_prototype_of', () => {
      it('should return true given input is prototype of object', () => {
        expect(is_prototype_of(new MockTwo(), Mock)).toBeTruthy();
      });

      it('should return false given input is not prototype of object', () => {
        expect(is_prototype_of(new MockThree(), Mock)).toBeFalsy();
      });
    });
  });
});
