const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, "./src/js/entry.js"),
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './public/'),
    filename: 'bundle.js'
  },
}
