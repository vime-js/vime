import Poster from '../Poster.svelte'

describe('components', () => {
  describe('Poster', () => {
    it('should look structurally correct when poster is set', () => {
      expect(Poster).toMatchRenderedSnapshot({
        poster: 'src',
        isShowing: true
      })
    })

    it('should look structurally correct when poster is not set', () => {
      expect(Poster).toMatchRenderedSnapshot({
        poster: null,
        isShowing: true
      })
    })

    it('should look structurally correct given a poster object', () => {
      expect(Poster).toMatchRenderedSnapshot({
        poster: { src: 'src', size: 'cover' },
        isShowing: true
      })
    })
  })
})
