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
};
