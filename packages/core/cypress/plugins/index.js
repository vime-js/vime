/// <reference types="cypress" />

const webpack = require('@cypress/webpack-preprocessor');
const webpackOptions = require('../webpack.config.js');
const { initPlugin: initSnapshots } = require('cypress-plugin-snapshots/plugin');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  initSnapshots(on, config)
  on('file:preprocessor', webpack({ webpackOptions }));
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push('--auto-open-devtools-for-tabs')
      launchOptions.args.push('--no-user-gesture-required')
      launchOptions.args.push('--disable-gesture-requirement-for-presentation')
      return launchOptions
    }
  });
};
