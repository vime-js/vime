const fs = require('fs');
const colors = require('colors');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const getFileSize = path => {
  const stats = fs.statSync(path);
  return prettyBytes(stats.size);
};

const getFileSizeGzipped = path => {
  const file = fs.readFileSync(path);
  return prettyBytes(gzipSize.sync(file));
};

const getFileSizes = path => {
  if (!fs.existsSync(path)) return null;
  return {
    original: getFileSize(path),
    compressed: getFileSizeGzipped(path)
  };
};

const pkgSizes = {};
const packagesPath = `${process.cwd()}/packages`;
const packages = fs.readdirSync(packagesPath);

packages.forEach(pkg => {
  if (
    !pkg.startsWith('vime') || 
    pkg.includes('core') || 
    pkg.includes('utils')
  ) return;
  const distPath = `${packagesPath}/${pkg}/dist/modern`;
  const litePath = `${distPath}/FileSizeLite.esm.js`;
  const fullPath = `${distPath}/FileSize.esm.js`;
  pkgSizes[pkg] = {
    lite: getFileSizes(litePath),
    full: getFileSizes(fullPath) 
  };
});

const printFileSizes = sizes => {
  const print = (title, size) => console.log(`    ${title}`.white, size.cyan);
  print('Original', sizes.original);
  print('Compressed', sizes.compressed);
};

Object.keys(pkgSizes).forEach(pkg => {
  const sizes = pkgSizes[pkg];
  console.log(pkg.bold.green);
  if (sizes.lite) {
    console.log(' Lite'.yellow.bold);
    printFileSizes(sizes.lite);
  }
  console.log(' Full'.red.bold);
  printFileSizes(sizes.full);
});
