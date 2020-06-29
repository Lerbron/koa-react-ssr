const baseConfig = require('./client.base')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const WebpackParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const analyzerPort = require('../index').analyzerPort

const config = {
  ...baseConfig,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            ie8: true,
          },
          ecma: 5,
          mangle: true,
          output: {
            comments: false,
          }
        },
        sourceMap: false
      }),
    ]
  },
  plugins: [
    ...baseConfig.plugins
  ],
  mode: 'production'
}

module.exports = config