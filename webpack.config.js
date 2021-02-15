const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './client/main.ts',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist/client'),
    compress: true,
    port: 9000,
  },
};

module.exports = config;