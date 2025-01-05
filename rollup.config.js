const pluginTerser = require('@rollup/plugin-terser');
const pluginTypescript = require('@rollup/plugin-typescript');

/** @type {import('typescript').CompilerOptions} */
const typescriptCompilerOptions = {
  declaration: false,
  module: 'ESNext',
  moduleResolution: 'Bundler',
  outDir: __dirname + '/dist/',
};

/** @type {import('@rollup/plugin-terser').Options} */
const terserOptions = {
  format: {
    comments: false,
  },
  mangle: {
    properties: { regex: /^_/ },
  },
};

/** @type {import('rollup').RollupOptions[]} */
module.exports = [
  {
    input: './src/index.ts',
    external: ['react'],
    output: {
      format: 'esm',
      file: './dist/react-mug.esm.min.js',
    },
    plugins: [
      pluginTypescript({
        tsconfig: './builder/tsconfig.esm.json',
        compilerOptions: typescriptCompilerOptions,
      }),
      pluginTerser(terserOptions),
    ],
  },
  {
    input: './src/index.ts',
    external: ['react'],
    output: {
      format: 'cjs',
      file: './dist/react-mug.cjs.min.js',
    },
    plugins: [
      pluginTypescript({
        tsconfig: './builder/tsconfig.cjs.json',
        compilerOptions: typescriptCompilerOptions,
      }),
      pluginTerser(terserOptions),
    ],
  },
];
