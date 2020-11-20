
// outsource dependencies
import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const OUTPUT_PATH = './dist';
const INPUT_PATH = './src/index.ts';

const FILE_NAME = 'redux-saga-controller';
const LIBRARY_NAME = 'redux-saga-controller';

const config: Configuration = {
  entry: {
    index: INPUT_PATH,
  },
  output: {
    path: path.resolve(__dirname, OUTPUT_PATH),
    filename: `${FILE_NAME}.js`,
    library: LIBRARY_NAME,
    libraryTarget: 'commonjs2',
    globalObject: 'this',
    umdNamedDefine: true,
  },
  watchOptions: {
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
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
