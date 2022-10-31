import Prism from 'prismjs'
import 'prismjs/components/prism-bash.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-yaml.min.js'

import 'prismjs/themes/prism.min.css'

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
export function highlightElement(preElement: Element, codeElement: Element, code: string, language: AvailableLanguages): void {
  if (!Prism.languages[language]) {
    console.warn(`Prism: the language “${language}” isn’t enabled.`)
  }

  if (!preElement.classList.contains(`language-${language}`)) {
    // Adds the language-* class which tells Prism which language to highlight for.
    preElement.classList.add(`language-${language}`)
  }

  // Ensures Prism operates on the raw code and not on an already highlighted DOM fragment.
  codeElement.innerHTML = code

  Prism.highlightElement(codeElement)
}
