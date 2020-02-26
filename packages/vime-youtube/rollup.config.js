import {
  chunkedBuild, modernBuild, legacyBuild, getFileName
} from '../../rollup-base'

const entry = 'src/index.js'
const name = 'YouTube'
const lite = { input: 'src/YouTubeLite.svelte' }
const full = { input: 'src/YouTube.js' }

const chunks = id => {
  if (id.includes('vime-youtube/src')) getFileName(id)
}

export default [
  modernBuild(lite),
  modernBuild(full)
]

// export default [
//   chunkedBuild({ input: { youtube: entry }, chunks }),
//   chunkedBuild({ input: { youtube: entry }, format: 'system', chunks }),
//   legacyBuild({ ...lite, name }),
//   legacyBuild({ ...full, name })
// ]
