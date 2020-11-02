const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    path: `${__dirname}/public/build`,
    filename: '[name].js',
  },
  mode,
  devtool: prod ? false : 'source-map',
  devServer: {
    contentBase: './public',
    publicPath: '/build',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
