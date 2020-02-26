import { canPlay } from '../Dailymotion.svelte';

describe('providers', () => {
  describe('Dailymotion', () => {
    const src = 'https://www.dailymotion.com/video/x3a9qe6';
    const embedSrc = 'https://www.dailymotion.com/embed/video/x3a9qe6';

    describe('canPlay', () => {
      it('should return true given a dailymotion url', () => {
        expect(canPlay(src)).toBeTruthy();
      });

      it('should return true given a dailymotion url without https://', () => {
        expect(canPlay(src.slice(8))).toBeTruthy();
      });

      it('should return true given a dailymotion url without https://www.', () => {
        expect(canPlay(src.slice(12))).toBeTruthy();
      });

      it('should return true given a dailymotion embed url', () => {
        expect(canPlay(embedSrc)).toBeTruthy();
      });
    });
  });
});
