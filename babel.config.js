/** @typedef {import('@babel/core').TransformOptions} Config */

/** @type {Config} */ const config = {
  presets: ['@babel/preset-env'],
  plugins: [
    // Required to run tests against code containing `import.meta.env` references.
    'babel-plugin-transform-vite-meta-env',
    // Required to run tests against code containing `import.meta.url` references.
    'babel-plugin-transform-import-meta',
  ],
}

module.exports = config
