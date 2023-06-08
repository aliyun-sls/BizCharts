import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'

export default {
	input: './src/index.jsx',
	output: {
		file: './dist/bundle.js',
		format: 'es',
		interop: 'esModule',
		strict: false,
	},
	external:['react', 'prop-types'],
	plugins:[
		// nodeResolve(),
		// commonjs({
		// }),
		esbuild({
			include: /\.jsx?$/,
			sourceMap: false,
			minify: false,
			target: 'es2015',
			loaders: {
        '.js': 'jsx',
      },
		}),
	]
};