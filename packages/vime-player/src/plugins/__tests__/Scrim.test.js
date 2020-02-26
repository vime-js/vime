import Scrim from '../Scrim';

describe('components', () => {
  describe('Scrim', () => {
    it('should look structurally correct', () => {
      expect(Scrim).toMatchRenderedSnapshot({ isActive: true });
    });
  });
});
