import path from 'path'

import {
  chunkedBuild, modernBuild, legacyBuild
} from '../../rollup-base'

const allEntry = 'src/index.js'
const componentsPath = 'src/components/'

const fullLegacyBuild = legacyBuild({
  input: allEntry,
  name: 'Vime',
  fileName: 'embed'
})

// Only used when testing modern file sizes, not needed otherwise.
const fullModernBuild = modernBuild({
  input: allEntry,
  fileName: 'embed'
})

const chunks = id => {
  if (id.includes('vime-embed/src/buildEmbedStore')) return 'buildEmbedStore'
  if (id.includes('vime-embed/src/components')) return path.parse(id).base.replace('.svelte', '')
}

const builds = [fullModernBuild]
// const builds = [
//   chunkedBuild({ input: { embed: allEntry }, chunks }),
//   chunkedBuild({ input: { embed: allEntry }, format: 'system', chunks }),
//   fullLegacyBuild
// ]

const providers = ['YouTube']
// const providers = ['YouTube', 'Vimeo', 'Dailymotion']
providers.forEach(name => {
  const basePath = componentsPath + `${name.toLowerCase()}/`
  const liteName = `${name}Lite`
  const lite = { input: `${basePath}${liteName}.svelte`, name: liteName, fileName: liteName }
  const heavy = { input: `${basePath}${name}.js`, name, fileName: name }
  builds.push(modernBuild(lite), modernBuild(heavy))
  // builds.push(legacyBuild(lite), legacyBuild(heavy))
})

export default builds
