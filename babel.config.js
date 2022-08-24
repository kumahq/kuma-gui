module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
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
