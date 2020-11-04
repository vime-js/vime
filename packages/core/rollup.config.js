import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'dist/custom-elements/index.js',
  output: {
    file: 'dist/custom-elements/index.js',
    format: 'esm',
  },
  plugins: [nodeResolve()],
};
