import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base';

const entry = 'src/index.js';
const name = 'Html5';
const player = { input: 'src/Html5.js' };

const chunks = id => {
  if (id.includes('vime-html5/src')) getFileName(id);
};

export default [
  chunkedBuild({ input: { html5: entry }, chunks }),
  chunkedBuild({ input: { html5: entry }, format: 'system', chunks }),
  legacyBuild({ ...player, name }),
  modernBuild({ ...player, fileName: 'FileSizeFull' })
];
