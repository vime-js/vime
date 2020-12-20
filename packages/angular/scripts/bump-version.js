const fs = require('fs');
const path = require('path');

const rootPkgPath = path.resolve(__dirname, '../package.json');
const distPkgPath = path.resolve(__dirname, '../dist/vime/angular/package.json');

const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath));
const distPkg = JSON.parse(fs.readFileSync(distPkgPath));

distPkg.version = rootPkg.version;
distPkg.dependencies['@vime/core'] = rootPkg.dependencies['@vime/core'];
fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, undefined, 2));
