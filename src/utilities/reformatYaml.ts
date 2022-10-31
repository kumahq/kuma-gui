/**
 * Returns a re-formatted YAML string for which singleline segments with “\n” characters were turned into multi-line strings using the YAML `|` syntax.
 */
export function reformatYaml(yaml: string, defaultIndentation: number = 2): string {
  let reformattedYaml = yaml

  while (true) {
    const match = reformattedYaml.match(/(['"])(.*\\n.*)(\1)/)

    if (match === null || match.index === undefined) {
      break
    }

    const segment = match[2]

    // Determines the positions at which to replace the single line segment. 2 needs to be added to account for the two wrapping quotation marks.
    const start = match.index
    const end = start + segment.length + 2

    // Removes a trailing “\n” character.
    const singleLineSegment = segment.endsWith('\\n') ? segment.substring(0, segment.length - 2) : segment

    // Determines the indentation of the preceding key.
    const precedingNewlinePos = reformattedYaml.lastIndexOf('\n', start)
    const head = reformattedYaml.substring(precedingNewlinePos + 1, start)
    const indentationMatch = head.match(/^(\s*)[a-zA-Z]/)

    if (indentationMatch === null) {
      break
    }

    // Wraps the single line segment onto separate lines with an additional level of indentation.
    const indent = indentationMatch[1] + ' '.repeat(defaultIndentation)
    const multiLineSegment = singleLineSegment.split('\\n').map((line) => indent + line).join('\n')

    reformattedYaml = reformattedYaml.substring(0, start) + '|\n' + multiLineSegment + reformattedYaml.substring(end)
  }

  return reformattedYaml
}
