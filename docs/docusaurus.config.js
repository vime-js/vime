const path = require('path');

module.exports = {
  title: 'Vime',
  tagline: 'Build and customize your own media player with web components.',
  url: 'https://vimejs.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'vime-js',
  projectName: 'vime',
  stylesheets: [
    'https://cdn.jsdelivr.net/npm/@vime/core@latest/themes/default.css',
    'https://cdn.jsdelivr.net/npm/@vime/core@latest/themes/light.css',
  ],
  themeConfig: {
    announcementBar: {
      content: '⭐️ &nbsp;If you like Vime, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/vime-js/vime">GitHub</a>!&nbsp;⭐️',
    },
    navbar: {
      title: 'Vime',
      hideOnScroll: true,
      logo: {
        alt: 'Vime Logo',
        src: 'img/vime.svg',
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
    prism: {
      // eslint-disable-next-line global-require
      theme: require('prism-react-renderer/themes/oceanicNext'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/vime-js/vime/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: ['appInstalled', 'queryString'],
        swCustom: path.resolve(__dirname, 'src/sw.js'),
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/vime.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(222, 66, 105)',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#000',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/vime.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/vime.svg',
            color: 'rgb(222, 66, 105)',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/vime.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#000',
          },
        ],
      },
    ],
  ],
};
