const path = require ('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const copyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    filename: path.resolve(__dirname, './index.js'),
  },
  performance: {
    hints: false,
    maxEntrypointSize: 712000,
    maxAssetSize: 712000
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devServer: {
    port: 9000,
    compress: true,
    hot: true,
    static: {
      directory: path.join(__dirname, 'dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: [
          'style-loader',
          {
            loader: miniCssExtractPlugin.loader,
            options: {
              esModule: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false
            }
          }
        ]
      },
    ]
  },
  optimization: {
    minimizer: [
      new cssMinimizerPlugin(),
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html'
    }),
    new miniCssExtractPlugin({
      filename: 'css/styles.css'
    }),
    new copyPlugin({
      patterns: [
        { from: './fonts', to: './fonts' },
        { from: './images', to: './images' },
        { from: './img', to: './img' }
      ]
    })
  ]
};
