import { canPlay } from '../Vimeo.svelte';

describe('providers', () => {
  describe('Vimeo', () => {
    const src = 'https://vimeo.com/154225711';
    const fileSrc = 'https://vimeo.com/external/154225711.source.mp4';

    describe('canPlay', () => {
      it('should return true given a vimeo url', () => {
        expect(canPlay(src)).toBeTruthy();
      });

      it('should return false given a vimeo file url', () => {
        expect(canPlay(fileSrc)).toBeFalsy();
      });
    });
  });
});
