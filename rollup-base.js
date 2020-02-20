import path from 'path'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import svg from 'rollup-plugin-svg'
import babel from 'rollup-plugin-babel'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import sveltePreprocess from 'svelte-preprocess'

const mode = process.env.NODE_ENV
const dev = mode === 'development'
const basePath = process.cwd()
const outputDir = `${basePath}/dist/`
const modernOutputDir = outputDir + 'modern/'
const legacyOutputDir = outputDir + 'legacy/'
let hasOutputCSS = false

export const getFileName = id => path.parse(id).base.replace(path.extname(id), '')

export const plugins = ({ legacy = false, externalCSS = false } = {}) => {
  return [
    nodeResolve({
      dedupe: importee => 
        importee === 'svelte' || 
        importee.startsWith('svelte/') ||
        importee.startsWith('@vime/core') ||
        importee.startsWith('@vime/utils')
    }),
    commonjs(),
    svg(),
    svelte({
      dev,
      preprocess: sveltePreprocess({
        postcss: require('../../postcss.config')(legacy)
      }),
      css: (!dev && externalCSS && !hasOutputCSS) ? css => {
        css.write(`${outputDir}/vime.css`)
        hasOutputCSS = true
      } : () => {}
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

const manualChunks = chunks => {
  return id => {
    if (id.includes('node_modules')) {
      const directories = id.split(path.sep)
      const name = directories[directories.lastIndexOf('node_modules') + 1]
      // Production
      if (name.match(/^@vime\/utils/)) return 'vime-utils'
      if (name.match(/^@vime\/core/)) return 'vime-core'
      if (name.match(/^svelte/)) return 'vime-internals'
      return name
    }
    
    // Local
    if (id.includes('packages/vime-utils')) return 'vime-utils'
    if (id.includes('packages/vime-core')) return 'vime-core'

    // Additional chunks packages might specify.
    const chunk = chunks && chunks(id)
    if (chunk) return chunk
  }
}

export const chunkedBuild = ({
  input,
  chunks, 
  format = 'esm', 
  pluginOpts = {} 
} = {}) => ({
  input,
  output: {
    dir: (format !== 'esm') ? `${legacyOutputDir}${format}` : modernOutputDir,
    format,
    entryFileNames: `[name].${format}.js`,
    chunkFileNames: `[name].${format}.js`
  },
  plugins: plugins({ legacy: (format !== 'esm'), ...pluginOpts }),
  manualChunks: manualChunks(chunks)
})

export const legacyBuild = ({ 
  input, 
  name = 'Vime', 
  fileName, 
  pluginOpts = {} 
} = {}) => ({
  input,
  output: {
    name: name,
    file: legacyOutputDir + `${fileName || name}.umd.js`,
    format: 'umd'
  },
  plugins: plugins({ legacy: true, ...pluginOpts })
})

export const modernBuild = ({ 
  input, 
  fileName, 
  pluginOpts = {} 
} = {}) => ({
  input,
  output: {
    file: modernOutputDir + `${fileName || getFileName(input)}.esm.js`,
    format: 'esm'
  },
  plugins: plugins(pluginOpts)
})