import { load_script, load_image } from '../load';

describe('utils', () => {
  describe('load', () => {
    describe('load_script', () => {
      // Arbitrary lightweight script.
      const src = 'https://cdn.jsdelivr.net/npm/mitt';

      beforeEach(() => {
        const script = document.createElement('script');
        document.body.appendChild(script);
      });

      it('should load script and insert before first script tag', (done) => {
        const onError = jest.fn();
        load_script(src, () => {
          expect(window.mitt).not.toBeUndefined();
          expect(onError).toHaveBeenCalledTimes(0);
          done();
        }, onError);
        const expectedBody = `<script src="${src}"></script><script></script>`;
        expect(document.body.innerHTML).toContain(expectedBody);
      });
    });

    describe('load_image', () => {
      const src = 'https://i.ytimg.com/vi/mN0zPOpADL4/hqdefault.jpg';

      it('should load an image', () => load_image(src, 121).then((image) => {
        expect(image.src).toBe(src);
      }));

      it('should reject image given the image width is not valid', (done) => {
        load_image(src, 481).catch(() => { done(); });
      });
    });
  });
});
