const { readFileSync: read } = require('fs')
module.exports = {
  depsToDevDeps: (path) => {
    const pkg = JSON.parse(read(path, 'utf-8'))
    return JSON.stringify({
      ...pkg,
      dependencies: {},
      peerDependencies: {},
      devDependencies: {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      },
    })
  },
}
