const path = require('path');
const pkg = require('./package.json');
const camelcase = require('camelcase');
const process = require('process');
const env = process.env;
const NODE_ENV = env.NODE_ENV;
const MIN = env.MIN == 'true';
const PROD = NODE_ENV === 'production';

let config = {
  mode: 'development', // NODE_ENV,   // https://webpack.js.org/guides/production/#specify-the-mode
  devtool: PROD ? false : 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: path.join( __dirname ),
    filename: pkg.name + '.js',
    library: camelcase( pkg.name ),
    libraryTarget: 'umd',
    globalObject: "this"
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: 'babel-loader' }
    ]
  },
  externals: PROD ? Object.keys( pkg.dependencies || {} ) : [],
  optimization: {
    minimize: MIN
  },
  devServer: {
    static: ['pages']
  }
};

module.exports = config;
