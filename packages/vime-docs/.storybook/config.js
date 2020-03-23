import { addParameters } from '@storybook/svelte'
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import theme from './theme';
import sortStories from './sortStories';

addParameters({
  options: {
    title: 'Vime',
    theme,
    showRoots: true,
    storySort: sortStories
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  }
});