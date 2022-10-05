import Prism from 'prismjs'
import 'prismjs/components/prism-bash.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-yaml.min.js'
import 'prismjs/plugins/line-highlight/prism-line-highlight.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'

import 'prismjs/themes/prism.min.css'
import 'prismjs/plugins/line-highlight/prism-line-highlight.min.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css'

Prism.manual = true

// When extending this type, make sure to also import the respective Prism language component above.
export type AvailableLanguages = 'plaintext' | 'bash' | 'json' | 'yaml'

/**
 * Low-level function for highlighting code.
 *
 * It’s currently not in use, but it’s convenient for testing our integration with PrismJS.
 */
export function _highlightCode(code: string, language: AvailableLanguages): string {
  const grammar = Prism.languages[language]

  return grammar !== undefined ? Prism.highlight(code, grammar, language) : code
}

/**
 * Syntax highlights the content of a `code` element.
 *
 * **Important implementation detail**:
 *
 * In order for plugins to work, a higher level function like `Prism.highlightElement` or `Prism.highlightAll` **must** be used. A lower level function like `Prism.highlight` does not call the necessary hooks for plugins to work.
 */
export function highlightElement(preElement: Element, codeElement: Element, language: AvailableLanguages): void {
  if (!preElement.classList.contains(`language-${language}`)) {
    // Adds the language-* class which tells Prism which language to highlight for.
    preElement.classList.add(`language-${language}`)
  }

  // Adds the `line-numbers` class which is necessary for the line-numbers plugin to work.
  if (!preElement.classList.contains('line-numbers')) {
    preElement.classList.add('line-numbers')
  }

  if (!Prism.languages[language]) {
    console.warn(`Prism: the language “${language}” isn’t enabled.`)
  }

  Prism.highlightElement(codeElement)

  const lineSpans = preElement.querySelectorAll('.line-numbers-rows > span')
  for (const [index, lineSpan] of lineSpans.entries()) {
    lineSpan.setAttribute('data-line', String(index + 1))
  }
}

export function highlightLines(preElement: Element, highlightedLineNumbers: number[]): void {
  const lineHighlights = preElement.querySelectorAll('[data-range]')
  for (const lineHighlight of lineHighlights) {
    lineHighlight.remove()
  }

  if (highlightedLineNumbers.length > 0) {
    const lines = Array.from(new Set(highlightedLineNumbers)).join(',')
    const mutateDom = Prism.plugins.lineHighlight.highlightLines(preElement, lines)
    mutateDom()
  }
}
