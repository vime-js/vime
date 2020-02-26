import { create_prop, merge_deep } from '../object';

describe('utils', () => {
  describe('object', () => {
    describe('create_prop', () => {
      it('should create a prop', () => {
        const id = 327;
        const obj = {};
        create_prop(obj, 'id', {
          get: () => id
        });
        expect(obj.id).toBe(id);
      });
    });

    describe('merge_deep', () => {
      const target = {
        a: 1,
        b: 2,
        c: {
          a: 4,
          b: 1
        },
        d: [1, 2, 3]
      };

      const source = {
        b: 4,
        c: {
          c: {
            a: 1
          },
          d: [1, 2, 3]
        },
        d: [4, 5]
      };

      it('should deep merge source into target', () => {
        const result = merge_deep(target, source);

        expect(result).toEqual({
          a: 1,
          b: 4,
          c: {
            a: 4,
            b: 1,
            c: {
              a: 1
            },
            d: [1, 2, 3]
          },
          d: [1, 2, 3, 4, 5]
        });
      });
    });
  });
});
