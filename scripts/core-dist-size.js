const fs = require('fs');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');

const getFileSizeGzipped = (path) => {
  const file = fs.readFileSync(path);
  return prettyBytes();
};

let bytes = 0;
let gzippedBytes = 0;
const distDir = './packages/core/dist/vime';
const files = fs.readdirSync(distDir);
files.forEach((file) => { 
  const path = `${distDir}/${file}`;
  bytes += fs.statSync(path).size;
  gzippedBytes += gzipSize.sync(fs.readFileSync(path));
});

console.log(`Original Size: ${prettyBytes(bytes)}`);
console.log(`Gzip Size: ${prettyBytes(gzippedBytes)}`);