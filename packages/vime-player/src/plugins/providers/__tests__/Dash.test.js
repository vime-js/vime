import { canPlay } from '../Dash.svelte';

describe('providers', () => {
  describe('Dash', () => {
    const file = ext => `https://someurl.com/somefile.${ext}`;
    const dashFile = file('mpd');

    describe('canPlay', () => {
      it('should return true given a dash file', () => {
        expect(canPlay(dashFile)).toBeTruthy();
      });

      it('should return true given any src html5 can play', () => {
        expect(canPlay(file('mp3'))).toBeTruthy();
        expect(canPlay(file('mp4'))).toBeTruthy();
      });
    });
  });
});
