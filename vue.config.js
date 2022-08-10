const webpack = require('webpack')

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: './',
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    sourceMap: false,
  },
  configureWebpack: {
    module: {
      rules: [
        /**
         * See: https://webpack.js.org/guides/asset-modules
         */
        {
          test: /\.(svg)(\?.*)?$/,
          oneOf: [
            // Imports SVGs as base64-encoded data URIs using `file.svg?inline`.
            {
              resourceQuery: /inline/,
              type: 'asset/inline',
            },
            // Imports all other SVGs as their original resource (i.e. SVG content).
            {
              type: 'asset/source',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    ],
    resolve: {
      fallback: {
        /**
         * The following fallbacks are required by msw since webpack v5
         * which no longer provides polyfills for Node.js built-ins.
         *
         * This is also the reason why the package process is installed.
         *
         * See: https://github.com/mswjs/msw/issues/1142
         */
        assert: require.resolve('assert'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
        timers: require.resolve('timers-browserify'),
        tty: require.resolve('tty-browserify'),
        url: require.resolve('url'),
        zlib: require.resolve('browserify-zlib'),
      },
    },
  },
  chainWebpack: (config) => {
    config.output.chunkFilename('js/[name].js?t=[chunkhash:8]')

    /**
     * Delete the default SVG rule from vue-cli as it uses an incorrect configuration.
     *
     * For reference, here is the complete error that it avoids:
     *
     * ```
     * Module not found: ValidationError: Invalid generator object.
     * Asset Modules Plugin has been initialized using a generator object that does not match the API schema.
     *   - generator has an unknown property 'filename'. These properties are valid:
     *     object { dataUrl? }
     *   -> Generator options for asset/inline modules.
      ```
     */
    const svgRule = config.module.rule('svg')

    svgRule.uses.clear()
    svgRule.delete('type')
    svgRule.delete('generator')
  },
}
