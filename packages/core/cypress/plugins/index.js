/// <reference types="cypress" />

const webpack = require('@cypress/webpack-preprocessor');
const initCoverage = require('@cypress/code-coverage/task');
const { initPlugin: initSnapshots } = require('cypress-plugin-snapshots/plugin');
const webpackOptions = require('../webpack.config.js');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  initSnapshots(on, config);
  initCoverage(on, config);
  on('file:preprocessor', webpack({ webpackOptions }));
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--auto-open-devtools-for-tabs');
      launchOptions.args.push('--no-user-gesture-required');
      launchOptions.args.push('--disable-gesture-requirement-for-presentation');
      return launchOptions;
    }
    return undefined;
  });
  return config;
};
