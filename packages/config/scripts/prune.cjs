const { readFileSync: read } = require('fs')
module.exports = {
  depsToDevDeps: (path) => {
    if (path && path.includes('..')) {
      throw new Error('Invalid file path, contains ..')
    }
    const pkg = JSON.parse(read(path, 'utf-8'))
    return JSON.stringify({
      ...pkg,
      dependencies: {},
      peerDependencies: {},
      devDependencies: {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      },
    }, null, 2)
  },
}
