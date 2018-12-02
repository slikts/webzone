const path = require(`path`)
const CleanWebpackPlugin = require(`clean-webpack-plugin`)
const HtmlWebpackPlugin = require(`html-webpack-plugin`)
const webpack = require(`webpack`)
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`)

module.exports = (_, argv) => {
  const devMode = argv.mode === `development`
  return {
    entry: `./src/index.js`,
    devtool: `inline-source-map`,
    mode: `development`,
    devServer: {
      contentBase: `./dist`,
      hot: true,
    },
    plugins: [
      new CleanWebpackPlugin([`dist`]),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        title: `slikts' webzone`,
        template: `static/index.html`,
        favicon: `static/favicon.ico`,
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? `[name].css` : `[name].[hash].css`,
        chunkFilename: devMode ? `[id].css` : `[id].[hash].css`,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            devMode ? `style-loader` : MiniCssExtractPlugin.loader,
            `css-loader`,
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: `babel-loader`,
            options: {
              presets: [
                [
                  `@babel/preset-env`,
                  { loose: true, useBuiltIns: `usage` },
                ],
              ],
            },
          },
        },
      ],
    },
    output: {
      filename: `[name].bundle.js`,
      path: path.resolve(__dirname, `dist`),
    },
  }
}
