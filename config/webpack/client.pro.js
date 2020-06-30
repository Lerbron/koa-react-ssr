const baseConfig = require('./client.base')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
      // 压缩css
			new OptimizeCSSAssetsPlugin({
				// 默认是全部的CSS都压缩，该字段可以指定某些要处理的文件
        assetNameRegExp: /\.(sa|sc|c)ss$/g, 
				cssProcessor: require('cssnano'),
				cssProcessorPluginOptions: {
					preset: ['default', {
						discardComments: {
							removeAll: true,
						},
						normalizeUnicode: false
					}]
				},
				canPrint: true
			})
    ]
  },
  plugins: [
    ...baseConfig.plugins
  ],
  mode: 'production'
}

module.exports = config