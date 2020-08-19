const { buildComponentsSideBarItems } = require('./helpers/components');

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Welcome',
      items: [
        'welcome/introduction',
        'welcome/why',
        'welcome/design-principles',
        'welcome/contributing'
      ],
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        {
          type: 'category',
          label: 'Installation',
          items: [
            'install/html',
            'install/react',
            'install/preact',
            'install/vue',
            'install/angular',
            'install/svelte',
          ],
        },
        'getting-started/player',
        'getting-started/providers',
        'getting-started/ui',
        'getting-started/controls',
        'getting-started/settings',
        'getting-started/styling',
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Components',
      items: buildComponentsSideBarItems(),
      collapsed: false,
    },
  ],
};
