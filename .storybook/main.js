const fs = require('fs');
const packagesPath = `${process.cwd()}/packages`;
const pkgStoriesPath = pkg => `${packagesPath}/${pkg}/stories`

let stories = []

fs.readdirSync(packagesPath).forEach(pkg => {
  const path = pkgStoriesPath(pkg);
  if (fs.existsSync(path)) stories.push(`${path}/*stories.js`);
});

module.exports = {
  stories
};