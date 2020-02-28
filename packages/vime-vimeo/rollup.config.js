import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base';

const entry = 'src/index.js';
const name = 'Vimeo';
const lite = { input: 'src/VimeoLite.svelte' };
const full = { input: 'src/Vimeo.js' };

const chunks = id => {
  if (id.includes('vime-vimeo/src')) getFileName(id);
};

export default [
  chunkedBuild({ input: { vimeo: entry }, chunks }),
  chunkedBuild({ input: { vimeo: entry }, format: 'system', chunks }),
  legacyBuild({ ...lite, name }),
  legacyBuild({ ...full, name }),
  modernBuild({ ...lite, fileName: 'FileSizeLite' }),
  modernBuild({ ...full, fileName: 'FileSizeFull' })
];
