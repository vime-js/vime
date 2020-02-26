import { canPlay } from '../YouTube.svelte';

describe('providers', () => {
  describe('YouTube', () => {
    const src = 'https://www.youtube.com/watch?v=R6MlUcmOul8';
    const shortSrc = 'https://youtu.be/R6MlUcmOul8';
    const embedSrc = 'https://www.youtube.com/embed/R6MlUcmOul8';

    describe('canPlay', () => {
      it('should return true given a youtube url', () => {
        expect(canPlay(src)).toBeTruthy();
      });

      it('should return true given a youtube shortened url', () => {
        expect(canPlay(shortSrc)).toBeTruthy();
      });

      it('should return true given a youtube embed url', () => {
        expect(canPlay(embedSrc)).toBeTruthy();
      });
    });
  });
});
