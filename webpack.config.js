const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const INPUT_PATH = './src/my-library.ts';
const OUTPUT_PATH = './dist';
const FILE_NAME = 'my-library';
const LIBRARY_NAME = 'MyLibrary';

const config = {
  target: 'web',
  entry: {
    index: INPUT_PATH,
  },
  output: {
    path: path.resolve(__dirname, OUTPUT_PATH),
    filename: `${FILE_NAME}.js`,
    library: LIBRARY_NAME,
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  watchOptions: {
    aggregateTimeout: 600,
    ignored: /node_modules/,
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, OUTPUT_PATH)],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, /test/],
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // * add some development rules here
  } else if (argv.mode === 'production') {
    // * add some prod rules here
  } else {
    throw new Error('Specify env');
  }

  return config;
};
