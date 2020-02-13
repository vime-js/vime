import path from 'path'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import svg from 'rollup-plugin-svg'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const entry = 'src/main.js'
const outputDir = 'dist'

let hasOutputCSS = false

function basePlugins ({ legacy = false } = {}) {
  return [
    nodeResolve({
      dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
    }),
    commonjs(),
    svg(),
    svelte({
      dev,
      preprocess: sveltePreprocess({
        postcss: require('./postcss.config')(legacy)
      }),
      css: (!dev && hasOutputCSS) ? () => {} : (css) => {
        css.write(`${outputDir}/vime.css`)
        hasOutputCSS = true
      }
    }),
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
    replace({ 'process.env.NODE_ENV': JSON.stringify(mode) }),
    // Minify the files when in production.
    !dev && terser({
      toplevel: true,
      ecma: legacy ? 5 : 8,
      safari10: !legacy,
      module: !legacy,
      compress: {
        passes: 3,
        drop_console: true,
        pure_funcs: ['log', 'warn', 'error']
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
    if (name.match(/^svelte/)) return 'vime-internals'
    return name
  }
  if (id.includes('src/utils')) return 'vime-utils'
  if (id.includes('src/core/store')) return 'GlobalStore'
  if (id.includes('src/lang')) return 'Language'
  if (id.includes('src/core') || id.includes('src/plugins')) {
    return path.parse(id).base.replace('.svelte', '')
  }
}

// Modern (ES2015/ES6) ESM bundle.
const modern = {
  input: {
    player: entry
  },
  output: {
    dir: outputDir + '/modern',
    format: 'esm',
    entryFileNames: '[name].esm.js',
    chunkFileNames: '[name].esm.js'
  },
  plugins: basePlugins(),
  manualChunks
}

// Legacy (ES5) UMD bundles.
const legacy = {
  input: entry,
  output: {
    name: 'Vime',
    file: outputDir + '/legacy/player.umd.js',
    format: 'umd'
  },
  plugins: basePlugins({ legacy: true })
}

// Legacy modules via System.js.
// @see https://github.com/systemjs/systemjs.
const legacySystem = {
  input: {
    player: entry
  },
  output: {
    dir: outputDir + '/legacy/system',
    format: 'system',
    entryFileNames: '[name].system.js',
    chunkFileNames: '[name].system.js'
  },
  plugins: basePlugins({ legacy: true }),
  manualChunks
}

export default [modern, legacy, legacySystem]
