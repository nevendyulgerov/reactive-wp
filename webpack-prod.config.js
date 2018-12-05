const stripLoader = require('strip-loader');
const devConfig = require('./webpack-dev.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const jsLoader = {
  test: [/\.(js|jsx|json)$/],
  exclude: /node_modules/,
  loader: stripLoader.loader('console.log')
};

devConfig.module.loaders.push(jsLoader);
devConfig.output.filename = '../bundle/scripts-bundle.min.js';
devConfig.plugins = [
  new ExtractTextPlugin({
    filename: '../bundle/styles-bundle.min.css',
    allChunks: true
  }),
];

module.exports = devConfig;
