const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
// const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'assets/js') + '/index.js',
  mode: 'development',
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: path.join(__dirname, 'build/images'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new NodePolyfillPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'assets/objects'),
          to: path.join(__dirname, 'build/objects'),
        },
        {
          from: path.join(__dirname, 'assets/images'),
          to: path.join(__dirname, 'build/images'),
        },
      ],
    }),
  ],
  // target: 'node',
  // externals: [nodeExternals()],
  devServer: {
    static: path.join(__dirname, 'build'),
    open: true,
  }
};