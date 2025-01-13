const { sync: globSync } = require('glob')

/**
 * @param {number} length
 * @param {string} prefix
 * @returns {string[]}
 */
function getPartitionedTestFiles(length, prefix = '') {
  const files = globSync(`${prefix}features/**/*.feature`)

  shuffleArray(files)

  /** @type {string[][]} */ const groups = Array.from({ length }, () => [])

  for (let i = 0; i < files.length; i++) {
    groups[i % length].push(files[i].replace(prefix, ''))
  }

  return groups.map((group) => group.join(','))
}

/**
 * Source: https://stackoverflow.com/a/12646864
 *
 * @param {any[]} array
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

module.exports = {
  getPartitionedTestFiles,
}
