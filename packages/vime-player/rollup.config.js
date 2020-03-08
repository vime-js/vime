import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base';

const name = 'Player';
const entry = 'src/index.js';
const chunkedEntry = { player: entry }
const pluginOpts = { externalCSS: false };

const chunks = id => {
  if (id.includes('vime-player/src/lang')) return 'vime-language';
};

export default [
  chunkedBuild({ input: chunkedEntry, chunks }),
  chunkedBuild({ input: chunkedEntry, format: 'system', chunks }),
  legacyBuild({ input: entry, name, pluginOpts }),
  modernBuild({ input: entry, fileName: 'FileSize', pluginOpts })
];