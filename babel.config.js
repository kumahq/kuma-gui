/** @typedef {import('@babel/core').TransformOptions} Config */

/** @type {Config} */ const config = {
  presets: ['@babel/preset-env'],
  plugins: [
    // Required to run tests against code containing `import.meta.env` references.
    'babel-plugin-transform-vite-meta-env',
    [
      'prismjs',
      {
        languages: ['bash', 'json', 'yaml'],
        plugins: ['line-numbers'],
        theme: 'default',
        css: true,
      },
    ],
  ],
}

module.exports = config
