import { create } from '@storybook/theming'
import { configure, addParameters } from '@storybook/svelte'

addParameters({
  options: {
    title: 'Vime',
    theme: create({
      base: 'dark',
      brandTitle: 'Vime',
      brandUrl: 'https://github.com/vime-js'
    })
  }
});