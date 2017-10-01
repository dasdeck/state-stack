/* jshint esversion: 6 */

import buble from 'rollup-plugin-buble'

export default {
  input: 'src/state-stack.js',
  output: {
    file: 'dist/state-stack.js',
    format: 'cjs',
    name: 'StateStack'
  },
  external: ['events', 'lodash'],
  plugins: [buble()]
}
