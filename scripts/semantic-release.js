const parser = require('git-log-parser');

// This hack allows us to use semantic-release for a monorepo.
// https://github.com/semantic-release/semantic-release/issues/193#issuecomment-578436666
parser.parse = ((parse) => (config, options) => {
  if (Array.isArray(config._)) {
    config._.push(options.cwd);
  } else if (config._) {
    // eslint-disable-next-line no-param-reassign
    config._ = [config._, options.cwd];
  } else {
    // eslint-disable-next-line no-param-reassign
    config._ = options.cwd;
  }
  return parse(config, options);
})(parser.parse);

const pkgName = process.env.npm_package_name;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAssets = () => {
  const assets = [{ path: 'dist', label: 'Distribution' }];
  if (pkgName === '@vime/core') {
    assets.push([
      { path: 'loader', label: 'Loader' },
      { path: 'icons', label: 'Icons' },
      { path: 'themes', label: 'Themes' },
    ]);
  }

  if (pkgName === '@vime/svelte') {
    assets.push({ path: 'src/svelte', label: 'Svelte Source' });
  }

  return assets;
};

module.exports = {
  tagFormat: `${pkgName}@\${version}`,
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/changelog',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    // ['@semantic-release/github', { assets: getAssets() }],
    '@semantic-release/git',
  ],
  prepare: [
    {
      path: '@semantic-release/changelog',
      changelogTitle: '# 🤖 Changelog\n\nAll notable changes will be listed here.',
    },
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      message: `chore(release): ${pkgName}@\${nextRelease.version} 🥳`,
    },
  ],
  success: [],
};
