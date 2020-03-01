import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base';

const name = 'Vime';
const entry = 'src/index.js';
const chunkedEntry = { player: entry }
const pluginOpts = { externalCSS: true };

const chunks = id => {
  if (id.includes('vime-player/src/lang')) return 'Language';
};

export default [
  chunkedBuild({ input: chunkedEntry, chunks }),
  chunkedBuild({ input: chunkedEntry, format: 'system', chunks }),
  legacyBuild({ input: entry, name, pluginOpts }),
  modernBuild({ input: entry, fileName: 'FileSize', pluginOpts })
];