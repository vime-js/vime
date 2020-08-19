module.exports = {
  title: 'Vime',
  tagline: 'Build and customize your own media player with web components.',
  url: 'https://vimejs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'vime-js',
  projectName: 'vime',
  themeConfig: {
    announcementBar: {
      id: 'supportus',
      content:
        '⭐️ If you like Vime, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/vime-js/vime">GitHub</a>! ⭐️',
    },
    navbar: {
      title: 'Vime',
      hideOnScroll: true,
      logo: {
        alt: 'Vime Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'demo/',
          activeBasePath: 'demo',
          label: 'Demo',
          position: 'right',
        },
        {
          href: 'https://github.com/vime-js/vime',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          homePageId: 'welcome/introduction',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/vime-js/vime/edit/master/packages/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
