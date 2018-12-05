const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: [
    './src/index.js',
    './src/index.scss'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|json)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.(css|sass|scss)$/,
        loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      },
      {
        test: /\.scss$/,
        use: 'sass-bulk-import-loader'
      },
      {
        test: /\.svg$/,
        use: 'svg-sprite-loader'
      }
    ],
    loaders: []
  },
  plugins: [
    new LiveReloadPlugin(),
    new ExtractTextPlugin({
      filename: './styles-bundle.css',
      allChunks: true,
    })
  ],
  output: {
    filename: 'scripts-bundle.js',
    path: path.resolve(__dirname, './bundle')
  }
};
