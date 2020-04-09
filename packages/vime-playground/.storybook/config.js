import theme from './theme';
import sortStories from './sortStories';
import { addParameters } from '@storybook/svelte'

addParameters({
  options: {
    title: 'Vime',
    theme,
    showRoots: true,
    storySort: sortStories
  }
});