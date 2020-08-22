const fs = require('fs');
const { resolve } = require('path');

const publicDir = resolve(__dirname, '../public');
if (fs.existsSync(publicDir)) return;
fs.mkdirSync(publicDir);

const links = [
  { from: resolve(__dirname, '../src'), to: `${publicDir}/src` },
  { from: resolve(__dirname, '../node_modules/@vime/media'), to: `${publicDir}/media` },
  { from: resolve(__dirname, '../dist'), to: `${publicDir}/dist` },
  { from: resolve(__dirname, '../tests'), to: `${publicDir}/tests` },
];

links.forEach((link) => {
  fs.symlinkSync(link.from, link.to);
});
