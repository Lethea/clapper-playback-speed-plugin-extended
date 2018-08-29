const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Is the current build a development build
const IS_DEV = process.env.NODE_ENV === 'dev';

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'src');
const dirAssets = path.join(__dirname, 'src/public');
const dirDemo = path.join(__dirname, 'demo');

/**
 * Webpack Configuration
 */
module.exports = {
  entry: path.join(dirApp, 'index'),
  externals: {
    Clappr: 'Clappr',
    'clappr-zepto': 'clappr-zepto',
  },
  resolve: {
    modules: [dirNode, dirApp, dirAssets],
    extensions: ['.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: IS_DEV,
    }),

    new HtmlWebpackPlugin({
      template: path.join(dirDemo, 'index.html'),
      title: 'Hello world',
    }),
  ],
  module: {
    rules: [
      // BABEL
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          compact: true,
        },
      },

      {
        test: /\.(html)$/,
        loader: 'html-loader',
      },

      {
        test: /\.css$/,
        loader: 'style-loader',
      },

      // CSS / SASS
      {
        test: /\.s[ac]ss/,
        use: [
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },

      // IMAGES
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
};
