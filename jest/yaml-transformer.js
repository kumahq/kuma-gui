const transformer = require('yaml-jest').default

module.exports = {
  ...transformer,
  process: function (...params) {
    return {
      code: transformer.process(...params),
      map: null,
    }
  },
}
