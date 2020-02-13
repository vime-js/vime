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
const basePath = process.env.cwd()
const outputDir = `${basePath}dist/`
const modernOutputDir = outputDir + 'modern/'
const legacyOutputDir = outputDir + 'legacy/'

export const plugins = ({ legacy = false, externalCSS = false } = {}) => {
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
      css: (!dev && externalCSS && hasOutputCSS) ? () => {} : (css) => {
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

export const chunkedBuild = (chunks, format, pluginOpts = {}) => ({
  input: {
    embed: allEntry
  },
  output: {
    dir: (format !== 'esm') ? `${legacyOutputDir}${format}` : modernOutputDir,
    format,
    entryFileNames: `[name].${format}.js`,
    chunkFileNames: `[name].${format}.js`
  },
  plugins: plugins({ legacy: (format !== 'esm'), ...pluginOpts }),
  manualChunks: chunks
})

export const legacyBuild = (name, input, fileName, pluginOpts = {}) => ({
  input,
  output: {
    name: name,
    file: legacyOutputDir + `${fileName}.umd.js`,
    format: 'umd'
  },
  plugins: plugins({ legacy: true, ...pluginOpts })
})

export const modernBuild = (input, fileName, pluginOpts = {}) => ({
  input,
  output: {
    file: modernOutputDir + `${fileName}.esm.js`,
    format: 'esm'
  },
  plugins: plugins(pluginOpts)
})