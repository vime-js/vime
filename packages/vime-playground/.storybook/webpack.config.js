const path = require('path')
const sveltePreprocess = require('svelte-preprocess')

const findRule = (config, fileType) => config.module.rules.find(
  r => r.test && r.test.toString().includes(fileType)
);

const addRule = (config, rule) => config.module.rules.push(rule);

module.exports = async ({ config }) => {
  const svelteLoader = findRule(config, 'svelte');
  svelteLoader.options = { 
    ...svelteLoader.options,
    preprocess: sveltePreprocess()
  };

  config.resolve.mainFields = ['svelte', 'browser', 'module', 'main'];
  config.resolve.alias.svelte = path.resolve('../../node_modules', 'svelte');

  return config;
}