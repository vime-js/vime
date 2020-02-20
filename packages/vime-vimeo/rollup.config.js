import path from 'path'

import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base'

const entry = 'src/index.js'
const lite = { input: 'src/VimeoLite.svelte' }
const full = { input: 'src/Vimeo.js' }

const chunks = id => {
  if (id.includes('vime-vimeo/src')) getFileName(id)
}

export default [
  modernBuild(lite),
  modernBuild(full)
]

// export default [
//   chunkedBuild({ input: { vimeo: entry }, chunks }),
//   chunkedBuild({ input: { vimeo: entry }, format: 'system', chunks }),
//   legacyBuild(lite),
//   legacyBuild(full)
// ]
