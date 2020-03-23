const { join } = require('path');
const slsw = require('serverless-webpack');

const context = __dirname;
const output = join(__dirname, 'dist');

module.exports = {
  context,
  mode: 'production',
  optimization: {
    minimize: false,
    occurrenceOrder: true,
    usedExports: true,
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 1000000,
    maxAssetSize: 1000000,
  },
  entry: slsw.lib.entries,
  output: {
    path: output,
    filename: '[name].js',
    library: 'index',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
};
