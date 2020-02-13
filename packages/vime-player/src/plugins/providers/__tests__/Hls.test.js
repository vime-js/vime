import { canPlay } from '../Hls.svelte'

describe('providers', () => {
  describe('Hls', () => {
    const file = ext => `https://someurl.com/somefile.${ext}`
    const hlsFile = file('m3u8')

    describe('canPlay', () => {
      it('should return true given a hls file', () => {
        expect(canPlay(hlsFile)).toBeTruthy()
      })

      it('should return true given any src html5 can play', () => {
        expect(canPlay(file('mp3'))).toBeTruthy()
        expect(canPlay(file('mp4'))).toBeTruthy()
      })
    })
  })
})
