import path from 'path'

import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base'

const entry = 'src/index.js'
const lite = { input: 'src/DailymotionLite.svelte' }
const full = { input: 'src/Dailymotion.js' }

const chunks = id => {
  if (id.includes('vime-dailymotion/src')) getFileName(id)
}

export default [
  modernBuild(lite),
  modernBuild(full)
]

// export default [
//   chunkedBuild({ input: { dailymotion: entry }, chunks }),
//   chunkedBuild({ input: { dailymotion: entry }, format: 'system', chunks }),
//   legacyBuild(lite),
//   legacyBuild(full)
// ]
