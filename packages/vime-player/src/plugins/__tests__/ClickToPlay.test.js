import { render } from '@testing-library/svelte';

import ClickToPlay from '../ClickToPlay.svelte';

describe('components', () => {
  describe('ClickToPlay', () => {
    it('should look structurally correct when paused', () => {
      expect(ClickToPlay).toMatchRenderedSnapshot({
        hasPlaybackStarted: false,
        isPaused: false
      });
    });

    it('should look structurally correct when not paused', () => {
      expect(ClickToPlay).toMatchRenderedSnapshot({
        hasPlaybackStarted: true,
        isPaused: true
      });
    });
  });
});
