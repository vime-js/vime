const fs = require('fs-extra');
const path = require('path');

const rootPkgDir = path.resolve(__dirname, '../');
const distPkgDir = path.resolve(__dirname, '../dist/vime/angular');

async function copyFiles() {
  try {
    await fs.copy(distPkgDir, rootPkgDir);
  } catch (err) {
    console.error(err);
  }
}

copyFiles();
