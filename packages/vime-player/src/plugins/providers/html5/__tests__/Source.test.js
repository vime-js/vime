import Source from '../Source.svelte';

describe('providers', () => {
  describe('Html5 Source', () => {
    it('should look structurally correct given null', () => {
      expect(Source).toMatchRenderedSnapshot({ src: null });
    });

    it('should look structurally correct given a string', () => {
      expect(Source).toMatchRenderedSnapshot({ src: '/src' });
    });

    it('should look structurally correct given an object', () => {
      expect(Source).toMatchRenderedSnapshot({
        src: {
          src: '/src',
          type: 'video/mp4'
        }
      });
    });

    it('should look structurally correct given an array', () => {
      expect(Source).toMatchRenderedSnapshot({ src: ['/src-1', '/src-2', '/src-3'] });
    });

    it('should look structurally correct given an array of objects', () => {
      expect(Source).toMatchRenderedSnapshot({
        src: [
          { src: '/src-1', type: 'video/mp4' },
          { src: '/src-2', type: 'video/mp4' }
        ]
      });
    });
  });
});
