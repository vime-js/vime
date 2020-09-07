module.exports = {
  tagFormat: `${process.env.npm_package_name}@\${version}`,
  verifyConditions: [
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    // '@semantic-release/github',
  ],
  prepare: [
    {
      path: '@semantic-release/changelog',
      changelogTitle: '# 🤖 Changelog\n\nAll notable changes will be listed here.',
    },
    '@semantic-release/npm',
    {
      path: '@semantic-release/git',
      message: `chore(release): ${process.env.npm_package_name}@\${nextRelease.version} 🥳`,
    },
  ],
  success: [],
};
