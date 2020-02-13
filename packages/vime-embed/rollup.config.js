import path from 'path'
import { is_string } from './src/utils/unit'
import babel from 'rollup-plugin-babel'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const componentsPath = 'src/components/'
const outputDir = 'dist/'
const allEntry = 'src/index.js'
const modernOutputDir = outputDir + 'modern/'
const legacyOutputDir = outputDir + 'legacy/'

function basePlugins ({ legacy = false } = {}) {
  return [
    nodeResolve({
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),
    svelte({ dev }),
    // Run babel when in production.
    !dev && babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      externalHelpers: true,
      exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
      presets: !legacy
        ? [['@babel/preset-modules', {
          loose: true
        }]]
        : [['@babel/preset-env', {
          loose: true,
          targets: ['ie 11'],
          useBuiltIns: 'usage',
          corejs: { version: 3, proposals: true }
        }]],
      plugins: [
        ['@babel/plugin-transform-runtime', { useESModules: !legacy }],
        legacy && ['babel-plugin-transform-async-to-promises', { hoist: true }]
      ].filter(Boolean)
    }),
    // Minify the files when in production.
    !dev && terser({
      toplevel: true,
      ecma: legacy ? 5 : 8,
      safari10: !legacy,
      module: !legacy,
      compress: {
        passes: 3,
        drop_console: true
      },
      output: {
        comments: false
      }
    })
  ]
}

const manualChunks = id => {
  if (id.includes('node_modules')) {
    const directories = id.split(path.sep)
    const name = directories[directories.lastIndexOf('node_modules') + 1]
    // Group svelte dependencies into a common chunk.
    if (name.match(/^svelte/)) return 'embed-internals'
    return name
  }
  if (id.includes('src/utils')) return 'embed-utils'
  if (id.includes('src/components')) return path.parse(id).base.replace('.svelte', '')
  if (id.includes('src/VideoQuality')) return 'VideoQuality'
  if (id.includes('src/EmbedEvent')) return 'EmbedEvent'
  if (id.includes('src/store')) return 'Store'
}

const chunkedBuild = format => ({
  input: {
    embed: allEntry
  },
  output: {
    dir: (format !== 'esm') ? `${legacyOutputDir}${format}` : modernOutputDir,
    format,
    entryFileNames: `[name].${format}.js`,
    chunkFileNames: `[name].${format}.js`
  },
  plugins: basePlugins({ legacy: (format !== 'esm') }),
  manualChunks
})

const legacyBuild = (name, input) => ({
  input,
  output: {
    name,
    file: legacyOutputDir + `${name}.umd.js`,
    format: 'umd'
  },
  plugins: basePlugins({ legacy: true })
})

const fullLegacyBuild = {
  input: allEntry,
  output: {
    name: 'Vime',
    file: legacyOutputDir + 'embed.umd.js',
    format: 'umd'
  },
  plugins: basePlugins({ legacy: true })
}

// Only used when testing modern file sizes, not needed otherwise.
const modernBuild = (name, input) => ({
  input,
  output: {
    file: modernOutputDir + `${name}.esm.js`,
    format: 'esm'
  },
  plugins: basePlugins()
})

// Only used when testing modern file sizes, not needed otherwise.
const fullModernBuild = {
  input: allEntry,
  output: {
    file: modernOutputDir + 'embed.esm.js',
    format: 'esm'
  },
  plugins: basePlugins()
}

// const builds = [fullModernBuild]
const builds = [chunkedBuild('esm'), chunkedBuild('system'), fullLegacyBuild]

const providers = ['YouTube', 'Vimeo', 'Dailymotion']
providers.forEach(name => {
  const basePath = componentsPath + `${name.toLowerCase()}/`
  const liteName = `${name}Lite`
  const litePath = `${basePath}${liteName}.svelte`
  const heavyPath = `${basePath}${name}.svelte`
  // builds.push(modernBuild(name, heavyPath), modernBuild(liteName, litePath))
  builds.push(legacyBuild(name, heavyPath), legacyBuild(liteName, litePath))
})

export default builds
