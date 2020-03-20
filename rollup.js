import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import svg from 'rollup-plugin-svg';
import babel from 'rollup-plugin-babel';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const basePath = process.cwd();
const outputDir = `${basePath}/dist/`;

export const plugins = options => {
  const { name, legacy, svelteDev, css } = options;

  return [
    nodeResolve({
      mainFields: ['svelte', 'module', 'main'],
      dedupe: importee => 
        importee === 'svelte' || 
        importee.startsWith('svelte/') ||
        importee.startsWith('@vime-js/') ||
        importee.includes('packages/vime-')
    }),
    commonjs(),
    svg(),
    svelte({
      dev: dev && svelteDev,
      preprocess: sveltePreprocess({
        postcss: require('../../postcss')(legacy)
      }),
      css: (!dev && css) ? css => {
        css.write(`${outputDir}${name}${legacy ? '-legacy' : ''}.css`);
      } : true
    }),
    (legacy || !dev) && babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      externalHelpers: true,
      exclude: ['node_modules/@babel/**', /\/core-js\//],
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
  ];
};

export const getFileName = id => path.parse(id).base.replace(path.extname(id), '');

export const getPackageName = id => {
  const matcher = /(?:vime\/packages\/vime-|@vime\/)((\w)+)/;
  const match = id.match(matcher);
  return match ? match[1] : null;
};

export const getPackageSubPath = id => {
  const matcher = /(?:vime\/packages\/vime-|@vime\/)(?:(?:\w)+)\/src\/(.+)\./;
  const match = id.match(matcher);
  return match ? match[1] : null;
};

// Really only used to manually check chunks and their output/size.
const manualChunks = (name, chunks) => {
  return id => {
    if (id.includes('node_modules')) {
      const directories = id.split(path.sep);
      const name = directories[directories.lastIndexOf('node_modules') + 1];
      // Production.
      if (name.match(/^@vime\/utils/)) return 'vime-utils';
      if (name.match(/^@vime\/core/)) return 'vime-core';
      if (name.match(/^svelte/)) return 'vime-internals';
      return name;
    }
    
    const pkgName = getPackageName(id);
    
    if (pkgName === name) {
      const subPath = getPackageSubPath(id);
      if (!subPath.includes('index')) return getPackageSubPath(id); 
    } else if (pkgName) {
      return `vime-${pkgName}`;
    }

    // Additional chunks packages might specify.
    const chunk = chunks && chunks(id);
    if (chunk) return chunk;
  };
};

export const chunkedEsmBuild = options => {
  const { name, input, chunks } = options;
  return {
    input: { [name]: input },
    output: {
      dir: outputDir,
      format: 'esm',
      entryFileNames: `[name].esm.js`,
      chunkFileNames: `[name].esm.js`
    },
    plugins: plugins({ legacy: false, ...options }),
    manualChunks: manualChunks(name, chunks)
  };
};

export const buildFile = options =>  {
  const { name, fileName, legacy  } = options;
  const outputName = (fileName || name);
  return [
    outputDir,
    outputName,
    !legacy && '.esm',
    !dev && '.min',
    '.js'
  ].filter(Boolean).join('');
};

export const esmBuild = options => {
  const { input } = options;
  return {
    input,
    output: {
      file: buildFile(options),
      format: 'esm'
    },
    plugins: plugins(options)
  };
};

export const umdBuild = options => {
  const { input } = options;
  const opts = { legacy: true, ...options };
  return {
    input,
    output: {
      name: 'Vime',
      file: buildFile(opts),
      format: 'umd',
      esModule: false
    },
    plugins: plugins(opts)
  };
};

export const basicBuild = options => {
  const { name, hasLite = true } = options;
  const input = 'src/index.js';
  return dev ? [
    // eg: vime.js
    umdBuild({ input, name }),
    // eg: vime.esm.js
    esmBuild({ name, input })
    // Checking chunks output/size.
    // chunkedEsmBuild({ input, name })
  ] : [
    // eg: vime.min.js
    umdBuild({ input, name }),
    // eg: vime.esm.min.js
    esmBuild({ input, name }),
    // eg: vime-lite.esm.min.js
    hasLite && esmBuild({ input: `src/${name}Lite.svelte`, name: `${name}-lite` })
  ].filter(Boolean);
};
