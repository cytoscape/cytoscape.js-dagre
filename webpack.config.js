const path = require('path');
const pkg = require('./package.json');
const camelcase = require('camelcase');
const process = require('process');
const env = process.env;
const NODE_ENV = env.NODE_ENV;
const MIN = env.MIN == 'true';
const PROD = NODE_ENV === 'production';

let config = {
  mode: NODE_ENV,
  devtool: PROD ? false : 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: {
      name: camelcase( pkg.name ),
      type: 'umd'
    },
    globalObject: "this"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  externals: [],
  optimization: {
    minimize: MIN
  }
};

module.exports = config;