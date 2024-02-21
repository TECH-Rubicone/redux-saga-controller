const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');


// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(module.exports = {
  title: 'redux-saga-controller',
  tagline: 'A tool to simplify work with react, redux and redux-saga',
  url: 'https://redux-saga-controller.js.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'TECH-Rubicone',
  projectName: 'redux-saga-controller',
  trailingSlash: false,
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/TECH-Rubicone/redux-saga-controller/edit/master/docs/intro.md',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/meta.svg',
      navbar: {
        title: 'redux-saga-controller',
        logo: {
          alt: 'redux-saga-controller',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'readme',
            position: 'left',
            label: 'Tutorial',
          },
          {
            href: 'https://www.npmjs.com/package/redux-saga-controller',
            label: 'NPM',
            position: 'right',
          },
          {
            href: 'https://github.com/TECH-Rubicone/redux-saga-controller',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/readme',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/redux-saga-controller',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/TECH-Rubicone/redux-saga-controller',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} TECH-Rubicone`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
});
