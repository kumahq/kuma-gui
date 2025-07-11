/**
 * Moves `@use` statements before data injected via vite’s `css.preprocessorOptions.scss.additionalData` option which avoids the following Sass error:
 *
 * ```
 * @use rules must be written before any other rules.
 * ```
 *
 * Source: https://github.com/vitejs/vite/discussions/6361#discussioncomment-6577205
 *
 * Code adapted from https://github.com/shakacode/sass-resources-loader/blob/ec1d6e5bf9668c1c68a7f10adb30c30740dedd96/src/utils/processResources.js#L3C6-L32
 */

// Matches opening and closing parenthesis across multiple lines
const multilineParenthesisRegex = '\\([\\s\\S]*?\\);?'
// Finds any @use statement
const useRegex = `^@use \\S*(?: with ${multilineParenthesisRegex}|.*)?\n?$`
// Same as above, but adds the m (multiline) flag
const useRegexTest = new RegExp(useRegex, 'm')
// Makes sure that only the last instance of `useRegex` variable is found
const useRegexReplace = new RegExp(`${useRegex}(?![\\s\\S]*${useRegex})`, 'gm')

export function hoistUseStatements(additionalData: string): (additionalData: string) => string {
  return function (source: string): string {
    if (useRegexTest.test(source)) {
      const output = source.replace(useRegexReplace, (useStatements) => `${useStatements}\n${additionalData}`)

      // De-duplicate identical imports
      const importedResources: Record<string, boolean | undefined> = {}
      return output.replace(new RegExp(useRegex, 'mg'), (importedResource: string) => {
        if (importedResources[importedResource]) {
          return ''
        }

        importedResources[importedResource] = true
        return importedResource
      })
    }

    return `${additionalData}\n${source}`
  }
}
