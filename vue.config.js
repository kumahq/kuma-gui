module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  transpileDependencies: [
    /@kongponents\/.*/
  ],
  css: {
    sourceMap: false
  },
  chainWebpack: config => {
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
