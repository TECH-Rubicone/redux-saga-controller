
// outsource dependencies
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';

// local dependencies
import pkg from './package.json';

// configure
const FILE_NAME = 'index';
const INPUT_FILE = 'src/index.ts';

const extensions = ['.ts'];
const noDeclarationFiles = { compilerOptions: { declaration: false } };

const babelRuntimeVersion = pkg.dependencies['@babel/runtime'].replace(/^[^0-9]*/, '');

const makeExternalPredicate = (externalArr) => {
  if (externalArr.length === 0) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
};

const prepare = ({ input, output, format, tsconfig, babelconfig }) => ({
  input,
  output: { file: `${output}/${FILE_NAME}.js`, format, indent: false },
  external: makeExternalPredicate([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),
  plugins: [
    nodeResolve({ extensions }),
    typescript(tsconfig),
    babel(babelconfig),
  ],
});

export default [
  // CommonJS
  prepare({
    input: INPUT_FILE,
    output: 'lib',
    format: 'cjs',
    tsconfig: { useTsconfigDeclarationDir: true },
    babel: {
      extensions,
      plugins: [
        ['@babel/plugin-transform-runtime', { version: babelRuntimeVersion }],
      ],
    }
  }),

  // ES
  prepare({
    input: INPUT_FILE,
    output: 'es',
    format: 'es',
    tsconfig: { tsconfigOverride: noDeclarationFiles },
    babel: {
      extensions,
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          { version: babelRuntimeVersion, useESModules: true },
        ],
      ],
    }
  }),
];
