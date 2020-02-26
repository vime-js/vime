import Time from '../Time.svelte';

describe('components', () => {
  describe('Time', () => {
    it('should look structurally correct', () => {
      expect(Time).toMatchRenderedWithContextSnapshot({
        time: 0,
        ariaLabel: 'time'
      });
    });
  });
});
