import theme from './theme';
import sortStories from './sortStories';
import { addParameters } from '@storybook/svelte'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

addParameters({
  options: {
    title: 'Vime',
    theme,
    showRoots: true,
    storySort: sortStories
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  }
});