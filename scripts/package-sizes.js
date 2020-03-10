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
  return {
    original: getFileSize(path),
    compressed: getFileSizeGzipped(path)
  };
};

const pkgSizes = {};
const packagesPath = `${process.cwd()}/packages`;
const packages = fs.readdirSync(packagesPath);
const packageFilter = process.argv.slice(2).map(p => p.startsWith('@') ? p.slice(1).replace('/', '-') : p);

packages.forEach(pkg => {
  if (
    !pkg.startsWith('vime') || 
    pkg.includes('core') || 
    pkg.includes('utils')
  ) return;
  if (packageFilter.length > 0 && !packageFilter.includes(pkg)) return;
  const distPath = `${packagesPath}/${pkg}/dist`;
  if (!fs.existsSync(distPath)) return;
  const distFiles = fs.readdirSync(distPath);
  pkgSizes[pkg] = {};
  distFiles.forEach(file => {
    pkgSizes[pkg][file] = getFileSizes(`${distPath}/${file}`);
  });
});

const printFileSizes = sizes => {
  const print = (title, size) => console.log(`    ${title}`.white, size.cyan);
  print('Original', sizes.original);
  print('Compressed', sizes.compressed);
};

Object.keys(pkgSizes).forEach(pkg => {
  const fileSizes = pkgSizes[pkg];
  console.log(pkg.green.bold);
  Object.keys(fileSizes).forEach(file => {
    console.log(`  ${file}`.white.bold);
    const sizes = fileSizes[file];
    printFileSizes(sizes);
  });
});
