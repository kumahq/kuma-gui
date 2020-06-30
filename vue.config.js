// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: './',
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    sourceMap: false
  },
  chainWebpack: config => {
    config.output
      .chunkFilename('js/[name].js?t=[chunkhash:8]')

    config.module
      .rule('ignore-some-things')
      .test(/\/(LICENSE|COPYRIGHT|CONTRIBUTORS|README)$|.*\.(txt|ijmap|md)|\/\..*/i)
      .use('ignore')
      .loader('ignore-loader')
      .end()

    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()
    svgRule
      .oneOf('external')
      .resourceQuery(/external/)
      .use('url')
      .loader('url-loader')
      .options({
        limit: 10000,
        name: 'img/[name].[hash:7].[ext]'
      }).end().end()
      .oneOf('normal')
      .use('raw')
      .loader('raw-loader')
      .end().end()
  }
}
