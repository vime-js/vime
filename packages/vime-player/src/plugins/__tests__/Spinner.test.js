import Spinner from '../Spinner'

describe('components', () => {
  describe('Spinner', () => {
    it('should look structurally correct', () => {
      expect(Spinner).toMatchRenderedSnapshot({ isActive: true })
    })
  })
})
