const path = require('path')
const sveltePreprocess = require('svelte-preprocess')

const findRule = (config, fileType) => config.module.rules.find(
  r => r.test && r.test.toString().includes(fileType)
);

const addRule = (config, rule) => config.module.rules.push(rule);

module.exports = async ({ config }) => {
  config.devtool = 'inline-source-map';

  const fileLoader = findRule(config, 'svg');
  fileLoader.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/;

  const svelteLoader = findRule(config, 'svelte');
  svelteLoader.options = { 
    ...svelteLoader.options,
    preprocess: sveltePreprocess({ 
      postcss: require('../postcss.config')()
    })
  };

  addRule(config, {
    test: /\.svg$/,
    loader: 'svg-inline-loader'
  });

  return config;
}