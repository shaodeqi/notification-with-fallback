// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'index.ts',
  output: {
    file: 'lib/index.min.js',
    format: 'umd',
    name: 'WebNotification'
  },
  plugins: [
    resolve(),
    typescript(),
    uglify()
  ]
};